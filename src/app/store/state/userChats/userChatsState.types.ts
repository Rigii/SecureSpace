export interface IUserChats {
  interlocutorId: string;
  accountId: string;
  created: Date | null;
  updated: Date | null;
  email: string;
  chatRoomIds: IChatRoomId[];
  invitations: IInvitations[];
}

export interface IChatRoomId {
  chatId: string;
  date: Date;
  updateDate: Date;
  isOwner: boolean;
  roomType: string;
  chatRoomName: string;
}

export interface IInvitations {
  chatId: string;
  date: Date;
}
