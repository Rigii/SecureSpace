import DocumentPicker, {
  DocumentPickerResponse,
} from 'react-native-document-picker';
import {generateThumbnail} from './thumbnail';
import {getFileContentRoomUploadUrl} from '../api/content/content-api';
import {encryptThumbnail} from '../pgp-encryption-service/encrypt-decrypt-thumbnail';

export const uploadThumbnailToMinio = async ({
  presignedUrl,
  encryptedThumbnail,
}: {
  presignedUrl: string;
  encryptedThumbnail: string;
}): Promise<void> =>
  fetch(presignedUrl, {
    method: 'PUT',
    body: encryptedThumbnail,
    headers: {'Content-Type': 'application/octet-stream'},
  }).then(response => {
    if (!response.ok) {
      throw new Error(`Thumbnail upload failed: ${response.status}`);
    }
  });

const pickFiles = (): Promise<DocumentPickerResponse[]> =>
  DocumentPicker.pick({
    type: [DocumentPicker.types.images, DocumentPicker.types.video],
    copyTo: 'cachesDirectory',
  });

const processFile = async (
  file: DocumentPickerResponse,
  uploadUrl: {presignedUrl: string; objectKey: string},
  thumbnailUploadUrl: {presignedUrl: string; objectKey: string},
  publicKeys: string[],
  userPrivateKey: string,
  passphrase: string,
): Promise<{
  objectKey: string;
  thumbnailKey: string;
  mimeType: string;
  fileName: string;
}> => {
  if (!file.fileCopyUri || !file.type || !file.name) {
    throw new Error('File URI is not available');
  }
  const thumbnailUri = await generateThumbnail(file.fileCopyUri, file.type);

  const thumbnailBuffer = await fetch(thumbnailUri).then(r => r.arrayBuffer());

  const encryptedThumbnail = await encryptThumbnail({
    thumbnailBuffer,
    publicKeys,
    userPrivateKey,
    passphrase,
  });

  await uploadThumbnailToMinio({
    presignedUrl: thumbnailUploadUrl.presignedUrl,
    encryptedThumbnail,
  });

  return {
    objectKey: uploadUrl.objectKey,
    thumbnailKey: thumbnailUploadUrl.objectKey,
    mimeType: file.type,
    fileName: file.name,
  };
};

// --- Main service ---

export const pickAndUploadFiles = async ({
  roomId,
  publicKeys,
  userPrivateKey,
  passphrase,
  token,
}: {
  roomId: string;
  publicKeys: string[];
  userPrivateKey: string;
  passphrase: string;
  token: string;
}): Promise<
  {
    objectKey: string;
    thumbnailKey: string;
    mimeType: string;
    fileName: string;
  }[]
> => {
  const files = await pickFiles();

  // request 2 urls per file (origin + thumbnail) in one call
  const [uploadUrlsResponse, thumbnailUploadUrlsResponse] = await Promise.all([
    getFileContentRoomUploadUrl({roomId, token}),
    getFileContentRoomUploadUrl({roomId, token}),
  ]);

  const uploadUrls = uploadUrlsResponse.data;
  const thumbnailUploadUrls = thumbnailUploadUrlsResponse.data;

  return Promise.all(
    files.map((file, index) =>
      processFile(
        file,
        uploadUrls[index],
        thumbnailUploadUrls[index],
        publicKeys,
        userPrivateKey,
        passphrase,
      ),
    ),
  );
};
