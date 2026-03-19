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

export enum EFileType {
  MEDIA = 'media',
  DOCUMENT = 'document',
}

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
  uploadUrl: {presignedUrl: string; objectKey: string; thumbnailUrl: string},
  publicKeys: string[],
  userPrivateKey: string,
  passphrase: string,
): Promise<{
  objectKey: string;
  mimeType: string;
  fileName: string;
}> => {
  if (!file.fileCopyUri || !file.type || !file.name) {
    throw new Error('File URI is not available');
  }
  const thumbnailLocalUri = await generateThumbnail(
    file.fileCopyUri,
    file.type,
  );

  const thumbnailBuffer = await fetch(thumbnailLocalUri).then(r =>
    r.arrayBuffer(),
  );

  const encryptedThumbnail = await encryptThumbnail({
    thumbnailBuffer,
    publicKeys,
    userPrivateKey,
    passphrase,
  });

  const urlTransactionData = await uploadThumbnailToMinio({
    presignedUrl: uploadUrl.thumbnailUrl,
    encryptedThumbnail,
  });

  return {
    objectKey: uploadUrl.objectKey,
    thumbnailKey: urlTransactionData.thumbnailUrl,
    mimeType: file.type,
    fileName: file.name,
  };
};

export const pickAndUploadFiles = async ({
  roomId,
  publicKeys,
  interlocutorId,
  userId,
  userPrivateKey,
  passphrase,
  type,
  token,
  generateThumbnailUrl,
}: {
  roomId: string;
  publicKeys: string[];
  interlocutorId: string;
  userId: string;
  userPrivateKey: string;
  passphrase: string;
  type: EFileType;
  token: string;
  generateThumbnailUrl: boolean;
}): Promise<
  {
    objectKey: string;
    thumbnailKey: string;
    mimeType: string;
    fileName: string;
  }[]
> => {
  const files =
    type === EFileType.MEDIA
      ? await pickMediaFiles()
      : await pickDocumentFiles();

  const filesMetadata: {
    fileName: string;
    fileSize: number;
    fileType: EFileType;
    generateThumbnailUrl: boolean;
  }[] = [];

  files.forEach(file => {
    if (!file.name || !file.size) {
      return;
    }

    filesMetadata.push({
      fileName: file.name,
      fileSize: file.size,
      fileType: type,
      generateThumbnailUrl,
    });
  });

  const uploadUrlsResponse = await getFileContentRoomUploadUrl({
    interlocutorId,
    userId,
    roomId,
    token,
    filesMetadata,
  });

  const uploadUrlTransaktionData = uploadUrlsResponse.data;
  console.log(55555555555, uploadUrlTransaktionData.uploadUrls);
  return Promise.all(
    files.map((file, index) =>
      processFile(
        file,
        uploadUrlTransaktionData.uploadUrls[index],
        publicKeys,
        userPrivateKey,
        passphrase,
      ),
    ),
  );
};
