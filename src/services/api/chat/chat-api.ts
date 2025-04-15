import {postData} from '../../xhr-services/api-service';

const CREATE_CHAT_USER_URL = '/chat/create-chat-user';
const GET_CHAT_USER_URL = '/chat/get-chat-user';
const GET_CHAT_ROOMS_URL = '/chat/get-chat-rooms';

export const createChatUserApi = async (
  chatUserData: {
    ownerEmail: string;
    ownerId: string;
    publicChatKey: string;
  },
  token: string,
) => postData(token, CREATE_CHAT_USER_URL, chatUserData);

export const getChatUserApi = async (ownerId: string, token: string) =>
  postData(token, GET_CHAT_USER_URL, {ownerId});

export const getChatRoomsData = async ({
  roomIds,
  token,
}: {
  roomIds: string[];
  token: string;
}) => postData(token, GET_CHAT_ROOMS_URL, {roomIds});
