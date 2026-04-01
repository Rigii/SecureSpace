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
}: {
  file: DocumentPickerResponse;
  uploadUrl: {
    presignedUrl: string;
    thumbnailObjectName: string;
    objectName: string;
    thumbnailUrl: string;
  };
  publicKeys: string[];
  userPrivateKey: string;
  passphrase: string;
  token: string;
  sessionId: string;
}) => {
  console.log(3333333, 'THUMB', {
    file,
    uploadUrl,
    publicKeys,
    userPrivateKey,
    passphrase,
    token,
    sessionId,
  });

  const thumbnailUploadResult = await processThumbnail({
    file,
    uploadUrl,
    publicKeys,
    userPrivateKey,
    passphrase,
    token,
    sessionId,
  });

  const uploadResult = await processContentTransaction({
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
    contentPathName: uploadResult.contentPathName,
    thumbnailPathName: thumbnailUploadResult.thumbnailPathName,
    mimeType: file.type,
    fileName: file.name,
  };
};

const processContentTransaction = async ({
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
    thumbnailUrl: string;
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
  userPrivateKey,
  passphrase,
  token,
  sessionId,
}: {
  file: DocumentPickerResponse;
  uploadUrl: {
    presignedUrl: string;
    thumbnailObjectName: string;
    objectName: string;
    thumbnailUrl: string;
  };
  publicKeys: string[];
  userPrivateKey: string;
  passphrase: string;
  token: string;
  sessionId: string;
}): Promise<{
  contentPathName: string;
  thumbnailLocalPath: string;
  thumbnailPathName: string;
  mimeType: string;
  fileName: string;
}> => {
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
      userPrivateKey,
      passphrase,
    });

    const uploadThumbnailResult = await uploadThumbnailToMinio({
      presignedUrl: uploadUrl.thumbnailUrl,
      encryptedThumbnail,
    });

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
      thumbnailPathName: uploadThumbnailResult.request.responseURL,
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
  type: EFileType;
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
