import {BASE_URL, BASE_URL_LOCAL} from '@env';
import {io, Socket} from 'socket.io-client';
import {ICreateChatRoom} from './chat-api.types';

const CHAT_ROOM_URL = '/chat_room';

export const socketMessageNamespaces = {
  CREATE_CHAT: 'create_chat',
  UPDATE_CHAT_OPTIONS: 'update_chat_options',
  INVITE_CHAT_PARTICIPANTS: 'invite_chat_participants',
  ADD_CHAT_PARTICIPANTS: 'add_chat_participants',
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

export const connectUserChatNotificationsSocket = (
  userIdChannel: string,
): Socket => {
  return io(`${BASE_URL_LOCAL}${CHAT_ROOM_URL}`, {
    query: {userId: userIdChannel},
    transports: ['websocket'],
    reconnection: true,
  });
};

export const createChatRoom = (socket: Socket, chatData: ICreateChatRoom) => {
  if (!socket) {
    console.error('WebSocket connection is not established.');
    return;
  }
  socket.emit(socketMessageNamespaces.CREATE_CHAT, chatData);

  socket.on(chatEvents.CREATE_CHAT_SUCCESS, data => {
    console.log('Chat room created successfully:', data);
  });

  socket.on(chatEvents.CREATE_CHAT_ERROR, error => {
    console.error('Error creating chat room:', error);
  });
};
