import {
  EContentFileStatus,
  EUploadContentRecipientType,
  TFileSessionProceedingStatus,
} from '../../file-content/types';
import {putContentToMinio} from '../../xhr-services/api-content-service';
import {postData} from '../../xhr-services/api-service';

const GET_CHAT_MESSAGE_UPLOAD_URL = '/content-storage/content-upload-url';
const UPDATE_CONTENT_TRANSACTION = '/content-storage/transaction-update';
const UPDATE_TRANSACTION_FILE_STATUS =
  '/content-storage/transaction-file-status';

export const getFileContentRoomUploadUrl = async ({
  filesMetadata,
  roomId,
  interlocutorId,
  userId,
  token,
}: {
  filesMetadata: {fileName: string; fileSize: number}[];
  roomId: string;
  interlocutorId: string;
  userId: string;
  token: string;
}) =>
  postData(token, GET_CHAT_MESSAGE_UPLOAD_URL, {
    filesMetadata,
    roomId,
    interlocutorId,
    userId,
  });

export const updateContentTransaction = async ({
  sessionType,
  sessionId,
  status,
  token,
}: {
  sessionType: string;
  sessionId: string;
  status: TFileSessionProceedingStatus;
  token: string;
}) =>
  postData(token, UPDATE_CONTENT_TRANSACTION, {
    sessionType,
    sessionId,
    status,
  });

export const updateTransactionFileStatus = async ({
  sessionType,
  sessionId,
  fileName,
  status,
  token,
}: {
  sessionType: EUploadContentRecipientType;
  sessionId: string;
  fileName: string;
  status: EContentFileStatus;
  token: string;
}) =>
  postData(token, UPDATE_TRANSACTION_FILE_STATUS, {
    sessionType,
    sessionId,
    fileName,
    status,
  });

export const uploadThumbnailToMinio = async ({
  presignedUrl,
  encryptedThumbnail,
}: {
  presignedUrl: string;
  encryptedThumbnail: string;
}): Promise<any> => putContentToMinio(presignedUrl, encryptedThumbnail);

export const uploadFileContentToMinio = async ({
  presignedUrl,
  encryptedFileContent,
}: {
  presignedUrl: string;
  encryptedFileContent: string;
}): Promise<any> => putContentToMinio(presignedUrl, encryptedFileContent);
