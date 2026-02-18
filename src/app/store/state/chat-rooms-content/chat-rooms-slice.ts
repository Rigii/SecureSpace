import {PayloadAction, createSlice} from '@reduxjs/toolkit';
import {
  IChatRoom,
  IChatRooms,
  IChatMessage,
  IdeleteChatRoomLocalData,
} from './chat-rooms-state.types';
import {
  addMessageToChatRoom,
  addMessagesToChatRoom,
  addNewChatRoom,
  addUserChatRooms,
  clearChatRoomData,
  deleteChatRoomLocalData,
  updateChatRoom,
} from './chat-room.actions';

const initialState: IChatRooms = {};

export const chatRoomsSlice = createSlice({
  name: 'anonymousUser',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder.addCase(
      addUserChatRooms,
      (state, action: PayloadAction<IChatRooms>) => {
        return {...state, ...action?.payload};
      },
    );

    builder.addCase(
      addNewChatRoom,
      (state, action: PayloadAction<IChatRoom>) => {
        if (state[action?.payload?.id]) {
          return;
        }

        const newRoom = {
          ...action.payload,
          messages: action.payload.messages || [],
        };
        return {...state, [action?.payload?.id]: newRoom};
      },
    );

    builder.addCase(
      updateChatRoom,
      (state, action: PayloadAction<IChatRoom>) => {
        return {...state, [action?.payload?.id]: action?.payload};
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
        const chatRoomId = action?.payload[0]?.chatRoomId;
        if (!state[chatRoomId]) {
          return;
        }
        const chatRoom = state[chatRoomId];

        chatRoom.messages = [...action?.payload];
      },
    );

    builder.addCase(
      addMessageToChatRoom,
      (state, action: PayloadAction<IChatMessage>) => {
        const chatRoomId = action?.payload?.chatRoomId;
        if (!state[chatRoomId]) {
          return;
        }
        const chatRoom = state[chatRoomId];

        /* NOTE:
        1. Dirrect change works — while createSlice uses Immer.js
        2. chatRoom.messages- undefined will cause issues with next spreading
        */
        chatRoom.messages = [...(chatRoom?.messages || []), action?.payload];
      },
    );

    builder.addCase(clearChatRoomData, () => {
      return initialState;
    });
  },
});

export default chatRoomsSlice.reducer;
