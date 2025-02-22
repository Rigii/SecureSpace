import {postData} from '../../xhr-services/api-service';

const CREATE_CHAT_USER_URL = '/chat/create-chat-user';

export const createChatUserApi = async (
  chatUserData: {
    ownerEmail: string;
    ownerId: string;
  },
  token: string,
) => postData(token, CREATE_CHAT_USER_URL, chatUserData);
