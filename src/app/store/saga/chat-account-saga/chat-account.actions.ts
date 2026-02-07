import {createAction} from '@reduxjs/toolkit';
import {Socket} from 'socket.io-client';
import {IChatSocketEvent} from './types';

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

export const handleChatSocketSaga = createAction<IChatSocketEvent>(
  'chat/chatSocketEvent',
);

export const leaveChatRoomSaga = createAction<{
  socket: Socket;
  chatRoomId: string;
}>('chat/leaveChatRoomSaga');

export const deleteChatRoomSaga = createAction<{
  socket: Socket;
  chatRoomId: string;
}>('chat/deleteChatRoomSaga');
