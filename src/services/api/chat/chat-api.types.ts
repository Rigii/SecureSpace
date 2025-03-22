export interface ICreateChatRoom {
  chatName: string;
  ownerId: string;
  ownerEmail: string;
  ownerNickName?: string;
  chatType: string;
  creatorPublicKeyIds: string[];
  locationAreaAvailability?: ISecurePlace[] | {}[];
  invitedUserEmails?: string[];
  lifeCycleLimitHours?: number;
  password?: string;
  chatIconUrl?: string;
}

export interface ISecurePlace {
  name: string;
  securePlaceData: {
    id: string;
    address: string;
    coordinates: {
      lat: string;
      long: string;
    };
  };
  securePlaceRadius: string;
}
