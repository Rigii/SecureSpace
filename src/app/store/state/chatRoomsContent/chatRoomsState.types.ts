export interface IChatRooms {
  [key: string]: IChatRoom;
}

export interface IChatRoom {
  id: string;
  chatName: string;
  chatType: string;
  ownerId: string;
  moderatorIds: string[];
  participiantIds: string[];
  usersData: IUserData[];
  invitedUserIds: string[];
  chat_icon_url: string;
  messages: IChatMessage[];
  created: Date | null;
  updated: Date | null;
}

interface IUserData {
  [key: string]: {
    user_id: string;
    public_key_id: string[];
    icon_url: string;
    nickname: string;
  };
}

export interface IChatMessage {
  id: string;
  participant_id: string;
  sender_nik_name: string;
  content: string;
  chatId: number;
  lifeCycleLimitHours: any; // Change the type to 'any'
  is_admin: boolean;
  media_url: string;
  voice_message_url: string;
  created: Date;
  updated: Date;
}
