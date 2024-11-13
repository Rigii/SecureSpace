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
}

export interface IUserState {
  userAccountData: IUserAccount;
  securityData: ISecurityData;
}
