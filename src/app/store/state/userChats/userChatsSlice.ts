import {PayloadAction, createSlice} from '@reduxjs/toolkit';
import {
  IChatRoomId,
  IFetchedChatRoomsData,
  IInvitations,
  IUserChats,
} from './userChatsState.types';
import {
  updateUserChatsAccountSlice,
  addInvitation,
  addActiveChatRoom,
  createUserChatsAccount,
} from './userChatsAction';

const initialState: IUserChats = {
  interlocutorId: '',
  accountId: '',
  created: null,
  updated: null,
  email: '',
  publicChatKey: '',
  privateChatKey: '',
  chatRoomIds: [],
  invitations: [],
};

export const userChatsReducer = createSlice({
  name: 'anonymousUser',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder.addCase(
      createUserChatsAccount,
      (state, action: PayloadAction<IUserChats>) => {
        return {...state, ...action.payload};
      },
    );

    builder.addCase(
      updateUserChatsAccountSlice,
      (state, action: PayloadAction<IFetchedChatRoomsData>) => {
        return {...state, ...action.payload};
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

export default userChatsReducer.reducer;
