import {getData, postData} from '../../xhr-services/api-service';

const CREATE_CHAT_USER_URL = '/chat/create-chat-user';
const GET_CHAT_USER_URL = '/chat/get-chat-user';

export const createChatUserApi = async (
  chatUserData: {
    ownerEmail: string;
    ownerId: string;
  },
  token: string,
) => postData(token, CREATE_CHAT_USER_URL, chatUserData);

export const getChatUserApi = async (ownerId: string, token: string) =>
  getData(token, GET_CHAT_USER_URL, {ownerId});
