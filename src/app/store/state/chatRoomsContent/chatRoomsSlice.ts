import {PayloadAction, createSlice} from '@reduxjs/toolkit';
import {
  IChatRoom,
  IChatRooms,
  IChatMessage,
  IdeleteChatRoomLocalData,
} from './chatRoomsState.types';
import {
  addMessageToChatRoom,
  addMessagesToChatRoom,
  addNewChatRoom,
  addUserChatRooms,
  deleteChatRoomLocalData,
  updateChatRoom,
} from './chatRoomsAction';

const initialState: IChatRooms = {};

export const chatRoomsReducer = createSlice({
  name: 'anonymousUser',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder.addCase(
      addUserChatRooms,
      (state, action: PayloadAction<IChatRooms>) => {
        return {...state, ...action.payload};
      },
    );

    builder.addCase(
      addNewChatRoom,
      (state, action: PayloadAction<IChatRoom>) => {
        if (state[action.payload.id]) {
          return;
        }
        return {...state, [action.payload.id]: action.payload};
      },
    );

    builder.addCase(
      updateChatRoom,
      (state, action: PayloadAction<IChatRoom>) => {
        return {...state, [action.payload.id]: action.payload};
      },
    );

    builder.addCase(
      deleteChatRoomLocalData,
      (state, action: PayloadAction<IdeleteChatRoomLocalData>) => {
        delete state[action?.payload?.chatRoomId];
      },
    );

    builder.addCase(
      addMessagesToChatRoom,
      (state, action: PayloadAction<IChatMessage[]>) => {
        const chatRoomId = action.payload[0].chatRoomId;
        if (!state[chatRoomId]) {
          return;
        }
        const chatRoom = state[chatRoomId];

        // dirrect change works — while createSlice uses Immer.js
        chatRoom.messages = [...action.payload];
      },
    );

    builder.addCase(
      addMessageToChatRoom,
      (state, action: PayloadAction<IChatMessage>) => {
        const chatRoomId = action.payload.chatRoomId;
        if (!state[chatRoomId]) {
          return;
        }
        const chatRoom = state[chatRoomId];

        // dirrect change works — while createSlice uses Immer.js
        chatRoom.messages = [...chatRoom.messages, action.payload];
      },
    );
  },
});

export default chatRoomsReducer.reducer;
