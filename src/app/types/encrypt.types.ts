export interface IManualEncryptionUserLimits {
  views: string[] | [];
  phoneVerification: string[] | [];
  locationLocked: string[] | [];
}

export interface IEncryptionUser {
  accountId: string;
  displayName: string;
  email: string;
  isPayed: boolean;
  isPlanInfoPublished?: boolean;
  paymentIntentId:
    | {
        id: string;
        date: Date;
      }[]
    | null;
  limits: IManualEncryptionUserLimits;
  trialPeriodData?: {
    date: string;
    isActivated: boolean;
  };
  isTrialActive?: boolean;
  referralInvitationData?: {referralId: string; referralSenderId: string};
  referralBonusPremium?: {
    activated: false;
    startDate?: Date;
  };
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
