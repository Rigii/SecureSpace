import {createAction} from '@reduxjs/toolkit';
import {IChatRoomId, IInvitations, IUserChats} from './userChatsState.types';

export const storeUserChats = createAction<IUserChats>(
  'anonymousUser/setAnonymousUser',
);

export const addInvitation = createAction<IInvitations>(
  'anonymousUser/addChatInvitations',
);

export const addActiveChatRoom = createAction<IChatRoomId>(
  'anonymousUser/addActiveChatRoom',
);
