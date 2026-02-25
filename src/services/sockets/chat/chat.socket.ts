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
import {
  socketEventStatus,
  socketMessageNamespaces,
} from '../../../context/chat/chat-provider.constants';

const CHAT_APP_URL = '/application-chat';

export const connectUserChatAppSocket = ({token}: {token: string}): Socket => {
  return io(`${BASE_URL}${CHAT_APP_URL}`, {
    /* The user data would be retrieved from the database during token validation. */
    auth: {token},
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

  socket.on(socketEventStatus.DELETE_CHAT_ROOM_SUCCESS, data => {
    console.info(strings.roomDeleted, data);
  });

  socket.on(socketEventStatus.DELETE_CHAT_ROOM_ERROR, error => {
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
      socketMessageNamespaces.JOIN_NEW_ROOM,
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

  socket.emit(socketMessageNamespaces.UNSUBSCRIBE_ROOM, chatData);
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

  socket.on(socketEventStatus.DECLINE_CHAT_INVITATION_SUCCESS, data => {
    console.info(strings.roomInvitationDeclinedDone, data);
    return data;
  });

  socket.on(socketEventStatus.DECLINE_CHAT_INVITATION_ERROR, error => {
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
