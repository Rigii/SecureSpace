import {BASE_URL_LOCAL} from '@env';
import {io, Socket} from 'socket.io-client';
import {ICreateChatRoom} from './chat-api.types';
import {strings} from './chat-sockets.strings';

const CHAT_ROOM_URL = '/chat_room';

export const socketMessageNamespaces = {
  CREATE_CHAT: 'create_chat',
  UPDATE_CHAT_OPTIONS: 'update_chat_options',
  INVITE_CHAT_PARTICIPANTS: 'invite_chat_participants',
  ADD_CHAT_PARTICIPANTS: 'add_chat_participants',
  FIND_ALL_USER_CHAT_ROOMS: 'find_all_user_chats',
  REMOVE_CHAT: 'remove_chat',
  JOIN_CHAT: 'join_chat',
  DECLINE_CHAT: 'decline_chat',
  SEND_MESSAGE: 'send_message',
  LEAVE_CHAT: 'leave_chat',
};

export const chatEvents = {
  USER_CHAT_INVITATION: 'user_chat_invitation',
  USER_CHAT_JOIN: 'user_chat_join',
  CREATE_CHAT_SUCCESS: 'create_chat_success',
  CREATE_CHAT_ERROR: 'create_chat_error',
  JOIN_CHAT_SUCCESS: 'join_chat_success',
  JOIN_CHAT_ERROR: 'join_chat_error',
  DECLINE_CHAT_INVITATION_SUCCESS: 'decline_chat_invitation_success',
  DECLINE_CHAT_INVITATION_ERROR: 'decline_chat_invitation_error',
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

export const createChatRoomSocket = (
  socket: Socket,
  chatData: ICreateChatRoom,
) => {
  if (!socket) {
    console.error(strings.wSConnectionNotEstablished);
    return;
  }
  socket.emit(socketMessageNamespaces.CREATE_CHAT, chatData);

  socket.on(chatEvents.CREATE_CHAT_SUCCESS, data => {
    console.log(strings.chatRooomCreated, data);
  });

  socket.on(chatEvents.CREATE_CHAT_ERROR, error => {
    console.error(strings.errorChatRooomCreation, error);
  });
};

export const joinChatRoomSocket = (
  socket: Socket | null,
  chatData: {chatId: string; interlocutorId: string},
) => {
  if (!socket) {
    console.error(strings.wSConnectionNotEstablished);
    return;
  }

  socket.emit(socketMessageNamespaces.JOIN_CHAT, chatData);

  socket.on(chatEvents.JOIN_CHAT_SUCCESS, data => {
    console.log(strings.roomJoined, data);
    return data;
  });

  socket.on(chatEvents.JOIN_CHAT_ERROR, error => {
    console.error(strings.joiningRoomError, error);
    throw new Error(error);
  });
};

export const declineChatRoomInvitationSocket = (
  socket: Socket | null,
  chatData: {chatId: string; interlocutorId: string},
) => {
  if (!socket) {
    console.error(strings.wSConnectionNotEstablished);
    return;
  }

  socket.emit(socketMessageNamespaces.DECLINE_CHAT, chatData);

  socket.on(chatEvents.DECLINE_CHAT_INVITATION_SUCCESS, data => {
    console.log(strings.roomInvitationDeclinedDone, data);
    return data;
  });

  socket.on(chatEvents.DECLINE_CHAT_INVITATION_ERROR, error => {
    console.error(strings.errorRoomInvitationDeclined, error);
    throw new Error(error);
  });
};
