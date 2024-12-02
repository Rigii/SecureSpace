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
  date: number;
  email: string;
  publicKey: string;
  os: string;
}

export interface IDataSecretsAPI {
  accountSecret?: string;
  destroyAccountSecret?: string;
  accessCredentials: {password: string; email: string}[];
  accountId: string;
  pgpPublicKey: IPublicKey;
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
  }[];
}

export type TOnboardingUserAPI = IUserOnboardingAPI & IDataSecretsAPI;
