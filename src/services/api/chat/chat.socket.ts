import {BASE_URL} from '@env';
import {io} from 'socket.io-client';

const CHAT_ROOM_URL = '/chat_room';

export const socketMessageNamespaces = {
  CREATE_CHAT: 'create_chat',
  UPDATE_CHAT_OPTIONS: 'update_chat_options',
  INVITE_CHAT_PARTICIPIANTS: 'invite_chat_participiants',
  ADD_CHAT_PARTICIPIANTS: 'add_chat_participiants',
  FIND_ALL_USER_CHAT_ROOMS: 'find_all_user_chats',
  REMOVE_CHAT: 'remove_chat',
  JOIN_CHAT: 'join_chat',
  SEND_MESSAGE: 'send_message',
  LEAVE_CHAT: 'leave_chat',
};

export const chatEvents = {
  USER_CHAT_INVITATION: 'user_chat_invitation',
  USER_CHAT_JOIN: 'user_chat_join',
  CREATE_CHAT_SUCCESS: 'create_chat_success',
  CREATE_CHAT_ERROR: 'create_chat_error',
};

export const listernUserChatNotifications = (userIdChannel: string) =>
  io(`${BASE_URL}${CHAT_ROOM_URL}`, {
    query: {userIdChannel},
  });
