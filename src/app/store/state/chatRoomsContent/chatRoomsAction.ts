import {createAction} from '@reduxjs/toolkit';
import {IChatMessage, IChatRoom, IChatRooms} from './chatRoomsState.types';

export const addUserChatRooms = createAction<IChatRooms>(
  'anonymousUser/addUserChatRooms',
);

export const addNewChatRoom = createAction<IChatRoom>(
  'anonymousUser/addNewChatRoom',
);

export const addMessageToChatRoom = createAction<IChatMessage>(
  'anonymousUser/addMessageToChatRoom',
);
