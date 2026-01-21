import {BASE_URL} from '@env';
import {io, Socket} from 'socket.io-client';
import {
  IChatMessage,
  IChatRoomSocketResponse,
  ICreateChatRoom,
  IDeleteChatRoom,
} from './chat-api.types';
import {strings} from './chat-sockets.strings';
import {
  EPopupType,
  ErrorNotificationHandler,
} from '../../ErrorNotificationHandler';
import {IChatRoom} from '../../../app/store/state/chatRoomsContent/chatRoomsState.types';

const CHAT_ROOM_URL = '/chat_room';

export const socketMessageNamespaces = {
  CREATE_CHAT: 'create_chat',
  UPDATE_CHAT_OPTIONS: 'update_chat_options',
  INVITE_CHAT_PARTICIPANTS: 'invite_chat_participants',
  ADD_CHAT_PARTICIPANTS: 'add_chat_participants',
  FIND_ALL_USER_CHAT_ROOMS: 'find_all_user_chats',
  DELETE_CHAT_ROOM: 'delete_chat_room',
  JOIN_CHAT: 'join_chat',
  DECLINE_CHAT: 'decline_chat',
  LEAVE_CHAT: 'leave_chat',
  CHAT_ROOM_MESSAGE: 'chat_room_message',
};

export const chatEvents = {
  USER_CHAT_INVITATION: 'user_chat_invitation',
  USER_CHAT_JOIN: 'user_chat_join',
  CREATE_CHAT_SUCCESS: 'create_chat_success',
  CREATE_CHAT_ERROR: 'create_chat_error',
  JOIN_CHAT_SUCCESS: 'join_chat_success',
  JOIN_CHAT_ERROR: 'join_chat_error',
  DELETE_CHAT_ROOM_SUCCESS: 'delete_chat_room_success',
  DELETE_CHAT_ROOM_ERROR: 'delete_chat_room_error',
  DECLINE_CHAT_INVITATION_SUCCESS: 'decline_chat_invitation_success',
  DECLINE_CHAT_INVITATION_ERROR: 'decline_chat_invitation_error',
  // ROOM_MESSAGE_SENT: 'room_message_sent',
  // ROOM_MESSAGE_FAILED: 'room_message_failed',
  ROOM_MESSAGE_RECEIVED: 'room_message_received',
  ROOM_MESSAGE_SEEN: 'room_message_seen',
};

export const connectUserChatNotificationsSocket = (
  userIdChannel: string,
  roomIds?: string[],
): Socket => {
  return io(`${BASE_URL}${CHAT_ROOM_URL}`, {
    query: {userId: userIdChannel, roomIds},
    transports: ['websocket'],
    reconnection: true,
  });
};

export const createChatRoomSocket = (
  socket: Socket,
  chatData: ICreateChatRoom,
): Promise<IChatRoom | null> => {
  return new Promise((resolve, reject) => {
    if (!socket) {
      reject(new Error(strings.wSConnectionNotEstablished));
      return;
    }

    socket.emit(
      socketMessageNamespaces.CREATE_CHAT,
      chatData,
      (response: IChatRoomSocketResponse) => {
        if (!response.success) {
          ErrorNotificationHandler({
            text1: strings.errorChatRooomCreation,
            text2: response.message,
            type: EPopupType.ERROR,
          });

          reject(new Error(response.message));
          return;
        }

        resolve(response.room);
      },
    );
  });
};

export const deleteChatRoomSocket = (
  socket: Socket,
  chatData: IDeleteChatRoom,
) => {
  if (!socket) {
    console.error(strings.wSConnectionNotEstablished);
    return;
  }
  socket.emit(socketMessageNamespaces.DELETE_CHAT_ROOM, chatData);

  socket.on(chatEvents.DELETE_CHAT_ROOM_SUCCESS, data => {
    console.log(strings.roomDeleted, data);
  });

  socket.on(chatEvents.DELETE_CHAT_ROOM_ERROR, error => {
    console.error(strings.errorDeletingChatRoom, error);
  });
};

export const joinChatRoomSocket = (
  socket: Socket | null,
  chatData: {userChatIds: string[]; interlocutorId: string},
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

export const leaveChatRoomSocket = (
  socket: Socket | null,
  chatData: {chatId: string; interlocutorId: string},
) => {
  if (!socket) {
    console.error(strings.wSConnectionNotEstablished);
    return;
  }

  socket.emit(socketMessageNamespaces.LEAVE_CHAT, chatData);
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

export const sendChatRoomMessage = (
  socket: Socket | null,
  messageData: IChatMessage,
) => {
  if (!socket) {
    console.error(strings.wSConnectionNotEstablished);
    return;
  }

  socket.emit(
    socketMessageNamespaces.CHAT_ROOM_MESSAGE,
    messageData,
    (response: {success: boolean; message?: string}) => {
      if (!response.success) {
        console.error(response.message);
        ErrorNotificationHandler({
          text1: strings.errorChatRooomCreation,
          text2: response.message,
          type: EPopupType.ERROR,
        });
        return;
      }
    },
  );
};
