import {IChatMessage} from '../../state/chat-rooms-content/chat-rooms-state.types';
import {TChatSocketEventType} from './workers/chat-socket.worker';
import {chatSocketSagaHandlers} from './workers/constants';

// "_id": "6987a1a2c115fe51094fd8c3", "chatRoomId": "45d05d0f-c96a-479a-ae3b-533a88cba644", "created": "Sat, 07 Feb 2026 20:33:38 GMT", "id": "6987a1a2c115fe51094fd8c3", "isAdmin": false, "message
// "participantId": "43efd72e-98b0-4dba-b387-a9eb2a88068c", "senderNickname": "jacob.savelievne@gmail.com", "updated":

export interface IChatSocketMessageType {
  [chatSocketSagaHandlers.USER_CHAT_INVITATION_WORKER]: {
    chatId: string;
    chatName: string;
    message: string;
  };
  [chatSocketSagaHandlers.ROOM_MESSAGE_NOTIFICATION_WORKER]: IChatMessage;
  [chatSocketSagaHandlers.ROOM_MESSAGE_LIST_WORKER]: IChatMessage;
}

export interface IChatSocketEvent {
  type: TChatSocketEventType;
  data: {
    currentActiveChatId: string | null;
    message:
      | IChatSocketMessageType[typeof chatSocketSagaHandlers.USER_CHAT_INVITATION_WORKER]
      | IChatSocketMessageType[typeof chatSocketSagaHandlers.ROOM_MESSAGE_NOTIFICATION_WORKER]
      | IChatSocketMessageType[typeof chatSocketSagaHandlers.ROOM_MESSAGE_LIST_WORKER];
  };
}
