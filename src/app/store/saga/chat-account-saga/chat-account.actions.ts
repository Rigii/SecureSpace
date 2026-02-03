import {createAction} from '@reduxjs/toolkit';

export const createChatAccount = createAction<{
  token: string;
  id: string;
  email: string;
  name?: string;
}>('chat/createChatAccountRequested');

export const createChatAccountSuccess = createAction(
  'chat/createChatAccountSuccess',
);

export const createChatAccountFailed = createAction<string>(
  'chat/createChatAccountFailed',
);
