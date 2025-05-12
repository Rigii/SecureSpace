import {createAction} from '@reduxjs/toolkit';
import {
  IChatMessage,
  IChatRoom,
  IChatRooms,
  IdeleteChatRoomLocalData,
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

export const deleteChatRoomLocalData = createAction<IdeleteChatRoomLocalData>(
  'anonymousUser/deleteChatRoomLocalData',
);

export const addMessageToChatRoom = createAction<IChatMessage>(
  'anonymousUser/addMessageToChatRoom',
);

export const addMessagesToChatRoom = createAction<IChatMessage[]>(
  'anonymousUser/addMessagesToChatRoom',
);
