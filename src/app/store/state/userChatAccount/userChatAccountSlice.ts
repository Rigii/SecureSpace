import {PayloadAction, createSlice} from '@reduxjs/toolkit';
import {
  IFetchedChatRoomsData,
  IInvitations,
  IUserChatAccount,
} from './userChatAccount.types';
import {
  updateUserChatsAccountSlice,
  addInvitation,
  createUserChatsAccount,
} from './userChatAccountAction';

const initialState: IUserChatAccount = {
  interlocutorId: '',
  chatAccountId: '',
  created: null,
  updated: null,
  email: '',
  publicChatKey: '',
  privateChatKey: '',
  invitations: [],
};

export const userChatAccountReducer = createSlice({
  name: 'anonymousUser',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder.addCase(
      createUserChatsAccount,
      (state, action: PayloadAction<IUserChatAccount>) => {
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

    // builder.addCase(
    //   addActiveChatRoom,
    //   (state, action: PayloadAction<IChatRoomId>) => {
    //     if (action.payload) {
    //       state.chatRoomIds.push(action.payload);
    //     }
    //   },
    // );
  },
});

export default userChatAccountReducer.reducer;
