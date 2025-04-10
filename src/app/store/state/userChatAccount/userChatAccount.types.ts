export interface IUserChatAccount {
  interlocutorId: string;
  chatAccountId: string;
  publicChatKey: string;
  privateChatKey: string;
  created: Date | null;
  updated: Date | null;
  email: string;
  invitations: IFetchedInvitations[];
}

export interface IFetchedChatRoomsData
  extends Omit<IUserChatAccount, 'publicChatKey' | 'privateChatKey'> {}

export interface IChatRoomId {
  chatId: string;
  date: Date;
  updateDate: Date;
  isOwner: boolean;
  roomType: string;
  chatRoomName: string;
}

export interface IFetchedInvitations {
  chatId: string;
  date: Date;
}
