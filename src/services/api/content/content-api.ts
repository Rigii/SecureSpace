import {postData} from '../../xhr-services/api-service';

const GET_CHAT_MESSAGE_UPLOAD_URL = '/content-storage/chat-message-upload-url';

export const getFileContentRoomUploadUrl = async ({
  roomId,
  pagination,
  token,
}: {
  roomId: string;
  pagination?: {page: number; limit: number};
  token: string;
}) => postData(token, GET_CHAT_MESSAGE_UPLOAD_URL, {roomId, pagination});
