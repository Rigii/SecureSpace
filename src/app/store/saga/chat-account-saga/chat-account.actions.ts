import {createAction} from '@reduxjs/toolkit';

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
