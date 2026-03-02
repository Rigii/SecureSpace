import {IChatMessage} from '../../state/chat-rooms-content/chat-rooms-state.types';
import {TChatSocketEventType} from './workers/chat-socket.worker';
import {chatSocketSagaHandlers} from './workers/constants';

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
    senderPublicKey?: string;
    message:
      | IChatSocketMessageType[typeof chatSocketSagaHandlers.USER_CHAT_INVITATION_WORKER]
      | IChatSocketMessageType[typeof chatSocketSagaHandlers.ROOM_MESSAGE_NOTIFICATION_WORKER]
      | IChatSocketMessageType[typeof chatSocketSagaHandlers.ROOM_MESSAGE_LIST_WORKER];
  };
}
