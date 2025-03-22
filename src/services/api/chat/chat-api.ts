import {getData, postData} from '../../xhr-services/api-service';
import {ICreateChatRoom} from './chat-api.types';

const CREATE_CHAT_USER_URL = '/chat/create-chat-user';
const GET_CHAT_USER_URL = '/chat/get-chat-user';
const GET_CHAT_ROOMS_URL = '/chat/get-chat-rooms';

export const createChatUserApi = async (
  chatUserData: {
    ownerEmail: string;
    ownerId: string;
  },
  token: string,
) => postData(token, CREATE_CHAT_USER_URL, chatUserData);

export const getChatUserApi = async (ownerId: string, token: string) =>
  getData(token, GET_CHAT_USER_URL, {ownerId});

export const getChatRoomsData = async (roomIds: string[], token: string) =>
  getData(token, GET_CHAT_ROOMS_URL, {roomIds});

export const createUpdateChatRoom = async (
  chatData: ICreateChatRoom,
  token: string,
) => postData(token, GET_CHAT_ROOMS_URL, chatData);
