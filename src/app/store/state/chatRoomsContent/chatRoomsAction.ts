import {createAction} from '@reduxjs/toolkit';
import {
  IChatMessage,
  IChatRoom,
  IChatRooms,
  IDeleteChatRoom,
} from './chatRoomsState.types';

export const addUserChatRooms = createAction<IChatRooms>(
  'anonymousUser/addUserChatRooms',
);

export const addNewChatRoom = createAction<IChatRoom>(
  'anonymousUser/addNewChatRoom',
);

export const updateChatRoom = createAction<IChatRoom>(
  'anonymousUser/updateChatRoom',
);

export const deleteChatRoom = createAction<IDeleteChatRoom>(
  'anonymousUser/deleteChatRoom',
);

export const addMessageToChatRoom = createAction<IChatMessage>(
  'anonymousUser/addMessageToChatRoom',
);
