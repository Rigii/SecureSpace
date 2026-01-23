import {IInvitations} from '../../../app/store/state/userChatAccount/userChatAccount.types';
import {postData} from '../../xhr-services/api-service';

const CREATE_CHAT_USER_URL = '/chat/create-chat-user';
const GET_CHAT_USER_URL = '/chat/get-chat-user';
const GET_CHAT_ROOMS_URL = '/chat/get-chat-rooms';
const GET_ROOM_MESSAGES_URL = '/chat/get-room-messages';

export const createChatUserApi = async (
  chatUserData: {
    ownerEmail: string;
    ownerId: string;
    publicChatKey: string;
  },
  token: string,
): Promise<{
  data: {
    public_chat_key: string;
    chat_account_id: string;
    interlocutor_id: string;
    created: Date;
    updated: Date;
    email: string;
    invitations: IInvitations[];
  };
}> => postData(token, CREATE_CHAT_USER_URL, chatUserData);

export const getChatUserApi = async (ownerId: string, token: string) =>
  postData(token, GET_CHAT_USER_URL, {ownerId});

export const getChatRoomsData = async ({
  roomIds,
  token,
}: {
  roomIds: string[];
  token: string;
}) => postData(token, GET_CHAT_ROOMS_URL, {roomIds});

export const getChatRoomMessages = async ({
  roomId,
  pagination,
  token,
}: {
  roomId: string;
  pagination?: {page: number; limit: number};
  token: string;
}) => postData(token, GET_ROOM_MESSAGES_URL, {roomId, pagination});
