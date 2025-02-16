import {PayloadAction, createSlice} from '@reduxjs/toolkit';
import {IChatRoom, IChatRooms, IChatMessage} from './chatRoomsState.types';
import {
  addMessageToChatRoom,
  addNewChatRoom,
  addUserChatRooms,
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
        state = action.payload;
      },
    );

    builder.addCase(
      addNewChatRoom,
      (state, action: PayloadAction<IChatRoom>) => {
        state = {...state, [action.payload.id]: action.payload};
      },
    );

    builder.addCase(
      addMessageToChatRoom,
      (state, action: PayloadAction<IChatMessage>) => {
        const chatRoomId = action.payload.id;

        if (!state[chatRoomId]) {
          return;
        }
        const chatRoom = state[chatRoomId];

        if (chatRoom) {
          chatRoom.messages.push(action.payload);
          state = {...state, [chatRoomId]: chatRoom};
        }
      },
    );
  },
});

export default chatRoomsReducer.reducer;
