import {IFetchedUserChatAccount} from '../../../../screens/login-signup/login-sign-up.types';
import {ISecurePlace} from '../../../types/encrypt.types';

export interface IChatRooms {
  [key: string]: IChatRoom;
}

export interface IdeleteChatRoomLocalData {
  chatRoomId: string;
}

export enum EChatVariants {
  private = 'private',
  multi = 'multi',
}

export interface IChatRoom {
  id: string;
  chatName: string;
  chatType: EChatVariants;
  ownerId: string;
  moderatorIds: string[];
  usersData?: IFetchedUserChatAccount;
  invitedUserIds: string[];
  messageDurationHours: number | null;
  password: string;
  chatMediaStorageUrl: string;
  chatIconUrl: string | null;
  availabilityAreaData: ISecurePlace | null;
  messages: IChatMessage[] | []; // Fetching messages from Mongodb by common chat ID. Start with the last date.
}

export interface IUserData {
  [key: string]: {
    user_id: string;
    public_key_id: string[];
    icon_url: string;
    nickname: string;
  };
}

export interface IChatMessage {
  id: string;
  participantId: string;
  senderNickame: string;
  message: string;
  chatRoomId: string;
  chatRoomName?: string;
  lifeCycleLimitHours?: number;
  isAdmin: boolean;
  mediaUrl?: string;
  voiceMessageUrl?: string;
  created: string;
  updated: string;
}
