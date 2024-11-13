export interface IUserOnboardingAPI {
  accountId: string;
  role: string;
  title: string;
  phone_number?: string;
  isOnboardingDone: boolean;
  portraitUri?: string;
  name: string;
}

export interface IPublicKey {
  approved: boolean;
  browser: string;
  email: string;
  id: string;
  loggedIn: boolean;
  publicKey: string;
}

export interface IDataSecretsAPI {
  accountSecret?: string;
  destroyAccountSecret?: string;
  accessCredentials: {password: string; email: string}[];
  accountId: string;
  securePlaces: {
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
    publicKey?: IPublicKey;
  }[];
}

export type TOnboardingUserAPI = IUserOnboardingAPI & IDataSecretsAPI;
