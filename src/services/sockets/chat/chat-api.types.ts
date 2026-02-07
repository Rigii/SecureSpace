import {IChatRoom} from '../../../app/store/state/chatRoomsContent/chatRoomsState.types';
import {ISecurePlaceData} from '../../../app/types/encrypt.types';

export interface ICreateChatRoom {
  chatName: string;
  interlocutorId: string;
  ownerEmail: string;
  ownerNickName?: string;
  chatType: string;
  creatorPublicChatKey: string;
  locationAreaAvailability?: ISecurePlace[];
  invitedUserEmails?: string[];
  lifeCycleLimitHours?: number;
  password?: string;
  chatIconUrl?: string;
}

export interface IChatRoomSocketResponse {
  success: boolean;
  message: string;
  room: IChatRoom | null;
}

export interface ISecurePlace {
  name: string;
  securePlaceData: ISecurePlaceData;
  securePlaceRadius: string;
}

export interface IChatMessage {
  chatRoomId: string;
  chatRoomName?: string;
  message: string;
  senderId: string;
  senderName: string;
}

export interface IDeleteChatRoom {
  roomId: string;
  interlocutorId: string;
}
