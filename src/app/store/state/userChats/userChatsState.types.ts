import {Timestamp} from 'react-native-reanimated/lib/typescript/reanimated2/commonTypes';

export interface IUserChats {
  interlocutorId: string;
  accountId: string;
  created: Timestamp | null;
  updated: Timestamp | null;
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
