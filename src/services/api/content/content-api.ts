import {putContentToMinio} from '../../xhr-services/api-content-service';
import {postData} from '../../xhr-services/api-service';

const GET_CHAT_MESSAGE_UPLOAD_URL = '/content-storage/content-upload-url';

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

export const uploadThumbnailToMinio = async ({
  presignedUrl,
  encryptedThumbnail,
}: {
  presignedUrl: string;
  encryptedThumbnail: string;
}): Promise<any> => putContentToMinio(presignedUrl, encryptedThumbnail);
