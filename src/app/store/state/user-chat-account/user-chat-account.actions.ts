import {createAction} from '@reduxjs/toolkit';
import {
  IChatRoomId,
  IFetchedChatRoomsData,
  IInvitations,
  IUserChatAccount,
} from './user-chat-account.types';

export const createUserChatsAccount = createAction<IUserChatAccount>(
  'anonymousUser/createUserChatsAccount',
);

export const updateUserChatsAccountSlice = createAction<IFetchedChatRoomsData>(
  'anonymousUser/updateUserChatsAccountSlice',
);

export const addInvitation = createAction<IInvitations>(
  'anonymousUser/addChatInvitations',
);

export const addActiveChatRoom = createAction<IChatRoomId>(
  'anonymousUser/addActiveChatRoom',
);

export const clearChatAccountData = createAction(
  'anonymousUser/clearChatAccountData',
);
