import {Timestamp} from 'react-native-reanimated/lib/typescript/reanimated2/commonTypes';

export interface IUserAccount {
  id: string;
  role: string;
  created?: Date | null;
  isOnboardingDone: boolean;
  email: string;
  token: string;
  portraitUri: string;
  title: string;
  phoneNumber?: string;
  name?: string;
}

export interface ISecurityData {
  accessCredentials: {email: string; password: string}[] | [];
  securePlaces:
    | {
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
      }[];
  pgpDeviceKeyData: IDeviceKeyData;
  deviceIdentifyer: {
    os: string;
    date: Timestamp | null;
  };
}

export interface IUserState {
  userAccountData: IUserAccount;
  securityData: ISecurityData;
}

export interface IDeviceKeyData {
  devicePrivateKey: string;
  devicePublicKey?: string;
  keyUUID: string;
  date: Timestamp | null;
  email: string;
  approved: boolean;
}
