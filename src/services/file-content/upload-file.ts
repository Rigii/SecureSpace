import DocumentPicker, {
  DocumentPickerResponse,
} from 'react-native-document-picker';
import {launchImageLibrary, Asset} from 'react-native-image-picker';
import {generateThumbnail} from './thumbnail';
import {
  getFileContentRoomUploadUrl,
  uploadThumbnailToMinio,
} from '../api/content/content-api';
import {encryptThumbnail} from '../pgp-encryption-service/encrypt-decrypt-thumbnail';

const pickMediaFiles = (): Promise<DocumentPickerResponse[]> =>
  new Promise((resolve, reject) => {
    launchImageLibrary({mediaType: 'mixed', selectionLimit: 0}, response => {
      if (response.didCancel) {
        reject(new Error('User cancelled'));
        return;
      }
      if (response.errorCode) {
        reject(new Error(response.errorMessage));
        return;
      }
      // Map Asset to DocumentPickerResponse shape
      const mapped: DocumentPickerResponse[] = (response.assets ?? []).map(
        (asset: Asset) => ({
          uri: asset.uri ?? '',
          fileCopyUri: asset.uri ?? '',
          type: asset.type ?? 'image/jpeg',
          name: asset.fileName ?? 'unknown',
          size: asset.fileSize ?? 0,
        }),
      );
      resolve(mapped);
    });
  });

const pickDocumentFiles = async (): Promise<DocumentPickerResponse[]> =>
  await DocumentPicker.pick({
    type: [DocumentPicker.types.allFiles],
    copyTo: 'cachesDirectory',
    mode: 'open',
    allowMultiSelection: true,
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

export const pickAndUploadFiles = async ({
  roomId,
  publicKeys,
  userPrivateKey,
  passphrase,
  type,
  token,
}: {
  roomId: string;
  publicKeys: string[];
  userPrivateKey: string;
  passphrase: string;
  type: 'media' | 'document';
  token: string;
}): Promise<
  {
    objectKey: string;
    thumbnailKey: string;
    mimeType: string;
    fileName: string;
  }[]
> => {
  const files =
    type === 'media' ? await pickMediaFiles() : await pickDocumentFiles();

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
