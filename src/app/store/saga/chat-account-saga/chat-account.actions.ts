import {createAction} from '@reduxjs/toolkit';
import {TChatSocketEventType} from './chat-socket.worker';

export const createChatAccountSaga = createAction(
  'chat/createChatAccountRequested',
);

export const createChatAccountSuccess = createAction(
  'chat/createChatAccountSuccess',
);

export const createChatAccountFailed = createAction<string>(
  'chat/createChatAccountFailed',
);

export const fetchUpdateChatStateSaga = createAction(
  'chat/updateChatAccountRequested',
);

export const handleChatSocketEvent = createAction<{
  type: TChatSocketEventType;
  data: {
    currentActiveChatId: string | null;
    message: {chatId: string; chatName: string; message: string};
  };
}>('chat/chatSocketEvent');
