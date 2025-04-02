import {createAction} from '@reduxjs/toolkit';
import {
  IChatRoomId,
  IFetchedChatRoomsData,
  IInvitations,
  IUserChats,
} from './userChatsState.types';

export const createUserChatsAccount = createAction<IUserChats>(
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
