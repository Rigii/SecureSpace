import {BASE_URL} from '@env';
import {io, Socket} from 'socket.io-client';
import {
  IChatMessage,
  IChatRoomSocketResponse,
  ICreateChatRoom,
  IDeleteChatRoom,
  IRoomSockerResponse,
} from './chat-api.types';
import {strings} from './chat-sockets.strings';
import {
  EPopupType,
  ErrorNotificationHandler,
} from '../../../components/popup-message/error-notification-handler';
import {IChatRoom} from '../../../app/store/state/chat-rooms-content/chat-rooms-state.types';

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
  ROOM_MESSAGE_SEEN: 'room_message_seen',
};

export const connectUserChatNotificationsSocket = (
  userIdChannel: string,
  roomId?: string,
): Socket => {
  return io(`${BASE_URL}${CHAT_ROOM_URL}`, {
    query: {userId: userIdChannel, roomId},
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
    console.info(strings.roomDeleted, data);
  });

  socket.on(chatEvents.DELETE_CHAT_ROOM_ERROR, error => {
    console.error(strings.errorDeletingChatRoom, error);
  });
};

export const joinChatRoomSocket = (
  socket: Socket | null,
  chatData: {userChatIds: string[]; interlocutorId: string},
) => {
  return new Promise((resolve, reject) => {
    if (!socket) {
      console.error(strings.wSConnectionNotEstablished);
      reject(new Error(strings.wSConnectionNotEstablished));
      return;
    }

    socket.emit(
      socketMessageNamespaces.JOIN_CHAT,
      {
        userChatId: chatData.userChatIds[0],
        interlocutorId: chatData.interlocutorId,
      },
      (response: IRoomSockerResponse) => {
        if (response.status === 'error') {
          ErrorNotificationHandler({
            text1: strings.errorAcceptingRoomInvitation,
            type: EPopupType.ERROR,
          });
          reject(new Error(strings.errorAcceptingRoomInvitation));
          return;
        }
        const fetchedRoomData = response.data?.chat_room;
        const roomData = {
          id: fetchedRoomData?.id || '',
          chatName: fetchedRoomData?.chat_name || '',
          chatType: fetchedRoomData?.chat_type || '',
          ownerId: fetchedRoomData?.owner_id || '',
          moderatorIds: fetchedRoomData?.moderator_ids || [],
          usersData: fetchedRoomData?.participants.map(participant => ({
            chat_account_id: participant.chat_account_id,
            created: participant.created,
            updated: participant.updated,
            email: participant.email,
            interlocutor_id: participant.interlocutor_id,
            public_chat_key: participant.public_chat_key,
          })),
          invitedUserIds: fetchedRoomData?.invited_user_ids || [],
          messageDurationHours: fetchedRoomData?.message_duration_hours || null,
          password: fetchedRoomData?.password || '',
          chatMediaStorageUrl: fetchedRoomData?.chat_media_storage_url || '',
          chatIconUrl: fetchedRoomData?.chat_icon_url || null,
          availabilityAreaData:
            fetchedRoomData?.location_area_availability || null,
          messages: [] as IChatMessage[],
        };

        resolve(roomData || null);
      },
    );
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
    console.info(strings.roomInvitationDeclinedDone, data);
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
