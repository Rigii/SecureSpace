import {IChatRoom} from '../../../app/store/state/chat-rooms-content/chat-rooms-state.types';
import {ISecurePlaceData} from '../../../app/types/encrypt.types';

export interface IResponseChatRoom {
  chat_icon_url: string | null;
  chat_key: string;
  chat_media_storage_url: string;
  chat_name: string;
  chat_type: string;
  created: string;
  id: string;
  invited_user_ids: string[];
  location_area_availability: {
    name: string;
    securePlaceData: ISecurePlaceData;
    securePlaceRadius: string;
  }[];
  message_duration_hours: number;
  moderator_ids: string[];
  owner_id: string;
  participants: {
    chat_account_id: string;
    created: string;
    updated: string;
    email: string;
    interlocutor_id: string;
    public_chat_key: string;
  }[];
  password?: string;
}

export interface ISocketResponse {
  event: string;
  status: string;
  timestamp: Date;
  code: number;
}
export interface IRoomSockerResponse extends ISocketResponse {
  data: {chat_room: IResponseChatRoom | null};
}

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
