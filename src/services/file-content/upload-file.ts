import DocumentPicker, {
  DocumentPickerResponse,
} from 'react-native-document-picker';
import {launchImageLibrary, Asset} from 'react-native-image-picker';
import {generateThumbnail} from './thumbnail';
import {
  getFileContentRoomUploadUrl,
  updateContentTransaction,
  updateTransactionFileStatus,
  uploadThumbnailToMinio,
} from '../api/content/content-api';
import {encryptThumbnail} from '../pgp-encryption-service/encrypt-decrypt-thumbnail';
import {
  EContentFileStatus,
  EFileType,
  EUploadContentRecipientType,
} from './types';

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

const uploadContentToMinio = async (
  file: DocumentPickerResponse,
  uploadUrl: {
    presignedUrl: string;
    thumbnailObjectName: string;
    objectName: string;
    thumbnailUrl: string;
  },
  publicKeys: string[],
  userPrivateKey: string,
  passphrase: string,
  token: string,
  sessionId: string,
) => {
  const thumbnailUploadResult = await processThumbnail(
    file,
    uploadUrl,
    publicKeys,
    userPrivateKey,
    passphrase,
    token,
    sessionId,
  );
};

const processThumbnail = async (
  file: DocumentPickerResponse,
  uploadUrl: {
    presignedUrl: string;
    thumbnailObjectName: string;
    objectName: string;
    thumbnailUrl: string;
  },
  publicKeys: string[],
  userPrivateKey: string,
  passphrase: string,
  token: string,
  sessionId: string,
): Promise<{
  contentPathName: string;
  thumbnailPathName: string;
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
  try {
    const thumbnailBuffer = await fetch(thumbnailLocalUri).then(r =>
      r.arrayBuffer(),
    );

    const encryptedThumbnail = await encryptThumbnail({
      thumbnailBuffer,
      publicKeys,
      userPrivateKey,
      passphrase,
    });

    await uploadThumbnailToMinio({
      presignedUrl: uploadUrl.thumbnailUrl,
      encryptedThumbnail,
    });

    /* Transaction File Update */
    const fileStatusUpdateResult = await updateTransactionFileStatus({
      sessionType: EUploadContentRecipientType.CHAT_ROOM,
      sessionId,
      fileName: file.name,
      status: EContentFileStatus.thumbnail_uploaded,
      token,
    });
    console.log(7777777, fileStatusUpdateResult);

    return {
      thumbnailPathName: uploadUrl.thumbnailObjectName,
      contentPathName: uploadUrl.objectName,
      mimeType: file.type,
      fileName: file.name,
    };
  } catch (error) {
    /* Transaction File Update */
    await updateTransactionFileStatus({
      sessionType: EUploadContentRecipientType.CHAT_ROOM,
      sessionId,
      fileName: file.name,
      status: EContentFileStatus.thumbnail_uploaded,
      token,
    });
    console.error('Error processing thumbnail:', error);
    throw error;
  }
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
    contentPathName: string;
    thumbnailPathName: string;
    mimeType: string;
    fileName: string;
  }[]
> => {
  try {
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

    const contentTransactionUpdateResult = await updateContentTransaction({
      sessionType: EUploadContentRecipientType.CHAT_ROOM,
      sessionId: uploadUrlTransaktionData.transactionId,
      status: 'uploading',
      token,
    });
    console.log(55555555555, contentTransactionUpdateResult);

    const data = await Promise.all(
      files.map((file, index) =>
        processThumbnail(
          file,
          uploadUrlTransaktionData.uploadUrls[index],
          publicKeys,
          userPrivateKey,
          passphrase,
          token,
          uploadUrlTransaktionData.transactionId,
        ),
      ),
    );

    return data;
  } catch (error) {
    console.error('Error picking or uploading files:', error);
    throw error;
  }
};
