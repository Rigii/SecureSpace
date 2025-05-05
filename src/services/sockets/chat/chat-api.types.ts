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

export interface ISecurePlace {
  name: string;
  securePlaceData: ISecurePlaceData;
  securePlaceRadius: string;
}

export interface IChatMessage {
  chatRoomId: string;
  message: string;
  senderId: string;
  senderName: string;
}
