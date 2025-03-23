import {ISecurePlaceData} from '../../app/types/encrypt.types';

export interface ICreateChatRoom {
  chatName: string;
  ownerId: string;
  ownerEmail: string;
  ownerNickName?: string;
  chatType: string;
  creatorPublicKeyIds: string[];
  locationAreaAvailability?: ISecurePlace[] | [];
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
