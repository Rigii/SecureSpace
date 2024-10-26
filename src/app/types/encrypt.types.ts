export enum ETitleForm {
  mister = 'mr',
  missis = 'ms',
  other = 'other',
}

export interface ITitleForm {
  id: string;
  label: string;
  value: ETitleForm.mister;
}

export interface IManualEncryptionUserLimits {
  views: string[] | [];
  phoneVerification: string[] | [];
  locationLocked: string[] | [];
}

export interface ISecurePlace {
  id: string;
  name: string;
  address: string;
  coordinates: {
    lat: string;
    long: string;
  };
  securePlaceRadius: string;
}

export type TSecurePlaces = Record<string, ISecurePlace> | {};

export interface ISecureOptions {
  imergencyPasswordsEmails: {email: string; password: string}[];
  securePlaces: TSecurePlaces;
}

export interface IOnboarding {
  secureOptions: ISecureOptions;
  displayName: string;
}

export interface IEncryptionUser {
  accountId: string;
  displayName: string;
  titleForm: ITitleForm;
  email: string;
  isPayed: boolean;
  isPlanInfoPublished?: boolean;
  paymentIntentId:
    | {
        id: string;
        date: Date;
      }[]
    | null;
  isCookiesAllowed: boolean;
  limits: IManualEncryptionUserLimits;
  trialPeriodData?: {
    date: string;
    isTrialActive: boolean;
  };
  referralInvitationData?: {referralId: string; referralSenderId: string};
  referralBonusPremium?: {
    activated: false;
    startDate?: Date;
  };
  secureOptions: ISecureOptions;
}

export interface IPaymentCustomer {
  email: string;
  id: string;
  invoice_prefix: string;
  created: number;
}

export enum EExpiry {
  tenMinutes = 'tenMinutes',
  oneHour = 'oneHour',
  oneDay = 'oneDay',
  oneWeek = 'oneWeek',
}
