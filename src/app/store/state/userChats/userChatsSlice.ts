import {PayloadAction, createSlice} from '@reduxjs/toolkit';
import {IChatRoomId, IInvitations, IUserChats} from './userChatsState.types';
import {
  storeUserChats,
  addInvitation,
  addActiveChatRoom,
} from './userChatsAction';

const initialState: IUserChats = {
  interlocutorId: '',
  accountId: '',
  created: null,
  updated: null,
  email: '',
  chatRoomIds: [],
  invitations: [],
};

export const anonymousUserSlice = createSlice({
  name: 'anonymousUser',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder.addCase(
      storeUserChats,
      (state, action: PayloadAction<IUserChats>) => {
        state = action.payload;
      },
    );

    builder.addCase(
      addInvitation,
      (state, action: PayloadAction<IInvitations>) => {
        if (action.payload) {
          state.invitations.push(action.payload);
        }
      },
    );

    builder.addCase(
      addActiveChatRoom,
      (state, action: PayloadAction<IChatRoomId>) => {
        if (action.payload) {
          state.chatRoomIds.push(action.payload);
        }
      },
    );
  },
});

export default anonymousUserSlice.reducer;
