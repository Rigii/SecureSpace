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
  EContentCategory,
  EUploadContentRecipientType,
} from './types';
import {uploadContentWithStream} from './upload-download-stream';
import {strings} from './file-content.strings';

export const pickMediaFiles = (): Promise<DocumentPickerResponse[]> =>
  new Promise((resolve, reject) => {
    launchImageLibrary({mediaType: 'mixed', selectionLimit: 0}, response => {
      if (response.didCancel) {
        reject(new Error(strings.userCancelled));
        return;
      }
      if (response.errorCode) {
        reject(new Error(response.errorMessage));
        return;
      }

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

export const pickDocumentFiles = async (): Promise<DocumentPickerResponse[]> =>
  await DocumentPicker.pick({
    type: [DocumentPicker.types.allFiles],
    copyTo: 'cachesDirectory',
    mode: 'open',
    allowMultiSelection: true,
  });

const uploadContentToMinio = async ({
  file,
  uploadUrl,
  publicKeys,
  userPrivateKey,
  passphrase,
  token,
  sessionId,
  generateThumbnailUrl,
}: {
  file: DocumentPickerResponse;
  uploadUrl: {
    presignedUrl: string;
    thumbnailObjectName: string;
    objectName: string;
    thumbnailUrl: string | null;
  };
  publicKeys: string[];
  userPrivateKey: string;
  passphrase: string;
  token: string;
  sessionId: string;
  generateThumbnailUrl: boolean;
}) => {
  if (generateThumbnailUrl) {
    await processThumbnail({
      file,
      uploadUrl,
      publicKeys,
      userPrivateKey,
      passphrase,
      token,
      sessionId,
    });
  }

  await processContent({
    file,
    uploadUrl,
    publicKeys,
    token,
    sessionId,
  });

  /* Transaction File Update "Completed" */
  await updateTransactionFileStatus({
    sessionType: EUploadContentRecipientType.CHAT_ROOM,
    sessionId,
    fileName: file.name || '',
    status: EContentFileStatus.completed,
    token,
  });

  return {
    contentPathName: uploadUrl?.objectName || '',
    thumbnailPathName: uploadUrl?.thumbnailObjectName || '',
    mimeType: file.type,
    fileName: file.name,
  };
};

const processContent = async ({
  file,
  uploadUrl,
  publicKeys,
  token,
  sessionId,
}: {
  file: DocumentPickerResponse;
  uploadUrl: {
    presignedUrl: string;
    thumbnailObjectName: string;
    objectName: string;
    thumbnailUrl: string | null;
  };
  publicKeys: string[];
  token: string;
  sessionId: string;
}): Promise<{
  contentPathName: string;
  mimeType: string;
  fileName: string;
}> => {
  if (!file.fileCopyUri || !file.type || !file.name) {
    throw new Error(strings.fileLocalDataIsNotAvailable);
  }
  try {
    /* Transaction File Update */
    await updateTransactionFileStatus({
      sessionType: EUploadContentRecipientType.CHAT_ROOM,
      sessionId,
      fileName: file.name,
      status: EContentFileStatus.file_uploading,
      token,
    });

    await uploadContentWithStream({
      file,
      publicKeys,
      uploadUrl,
    });

    /* Transaction File Update */
    await updateTransactionFileStatus({
      sessionType: EUploadContentRecipientType.CHAT_ROOM,
      sessionId,
      fileName: file.name,
      status: EContentFileStatus.file_uploaded,
      token,
    });

    return {
      contentPathName: uploadUrl.presignedUrl,
      mimeType: file.type,
      fileName: file.name,
    };
  } catch (error) {
    await updateTransactionFileStatus({
      sessionType: EUploadContentRecipientType.CHAT_ROOM,
      sessionId,
      fileName: file.name,
      status: EContentFileStatus.file_failed,
      token,
    });
    throw error;
  }
};

const processThumbnail = async ({
  file,
  uploadUrl,
  publicKeys,
  token,
  sessionId,
}: {
  file: DocumentPickerResponse;
  uploadUrl: {
    presignedUrl: string;
    thumbnailObjectName: string;
    objectName: string;
    thumbnailUrl: string | null;
  };
  publicKeys: string[];
  userPrivateKey: string;
  passphrase: string;
  token: string;
  sessionId: string;
}) => {
  if (!file.fileCopyUri || !file.type || !file.name) {
    throw new Error(strings.fileURLIsNotAvailable);
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
    });
    if (uploadUrl.thumbnailUrl) {
      await uploadThumbnailToMinio({
        presignedUrl: uploadUrl.thumbnailUrl,
        encryptedThumbnail,
      });
    }
    /* Transaction File Update */
    await updateTransactionFileStatus({
      sessionType: EUploadContentRecipientType.CHAT_ROOM,
      sessionId,
      fileName: file.name,
      status: EContentFileStatus.thumbnail_uploaded,
      token,
    });

    return {
      thumbnailLocalPath: thumbnailLocalUri,
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
      status: EContentFileStatus.thumbnail_failed,
      token,
    });
    console.error(strings.errorProcessingThumbnail, error);
    throw error;
  }
};

export const uploadFiles = async ({
  roomId,
  publicKeys,
  interlocutorId,
  userId,
  userPrivateKey,
  passphrase,
  type,
  token,
  generateThumbnailUrl,
  files,
}: {
  roomId: string;
  publicKeys: string[];
  interlocutorId: string;
  userId: string;
  userPrivateKey: string;
  passphrase: string;
  type: EContentCategory;
  token: string;
  generateThumbnailUrl: boolean;
  files: DocumentPickerResponse[];
}): Promise<
  {
    contentPathName: string;
    thumbnailPathName: string;
    mimeType: string | null;
    fileName: string | null;
  }[]
> => {
  let uploadUrlTransaktionData;
  const filesMetadata: {
    fileName: string;
    fileSize: number;
    fileType: EContentCategory;
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

  try {
    const uploadUrlsResponse = await getFileContentRoomUploadUrl({
      interlocutorId,
      userId,
      roomId,
      token,
      filesMetadata,
    });

    uploadUrlTransaktionData = uploadUrlsResponse.data;
  } catch (error) {
    console.error(strings.errorGettingUploadUrls, error);
    throw error;
  }

  try {
    await updateContentTransaction({
      sessionType: EUploadContentRecipientType.CHAT_ROOM,
      sessionId: uploadUrlTransaktionData.contentUploadTransaktionData.id,
      status: 'uploading',
      token,
    });

    const data = await Promise.all(
      files.map((file, index) =>
        uploadContentToMinio({
          file,
          uploadUrl: {
            presignedUrl: uploadUrlTransaktionData.uploadUrls[index].url,
            thumbnailObjectName:
              uploadUrlTransaktionData.uploadUrls[index].thumbnailObjectName,
            objectName: uploadUrlTransaktionData.uploadUrls[index].objectName,
            thumbnailUrl:
              uploadUrlTransaktionData.uploadUrls[index].thumbnailUrl,
          },
          publicKeys,
          userPrivateKey,
          passphrase,
          token,
          sessionId: uploadUrlTransaktionData.contentUploadTransaktionData.id,
          generateThumbnailUrl,
        }),
      ),
    );

    await updateContentTransaction({
      sessionType: EUploadContentRecipientType.CHAT_ROOM,
      sessionId: uploadUrlTransaktionData.contentUploadTransaktionData.id,
      status: 'completed',
      token,
    });

    return data;
  } catch (error) {
    await updateContentTransaction({
      sessionType: EUploadContentRecipientType.CHAT_ROOM,
      sessionId: uploadUrlTransaktionData.contentUploadTransaktionData.id,
      status: 'completed',
      token,
    });
    console.error(strings.errorPickingOrUploadingFiles, error);
    throw error;
  }
};
