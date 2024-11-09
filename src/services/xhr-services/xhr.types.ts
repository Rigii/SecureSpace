export enum EErrorCases {
  link_absent = 'link_absent',
  expired = 'expired',
  noMessage = 'noMessage',
  destroyed = 'destroyed',
  noKey = 'noKey',
  invalidEmailOrPhone = 'invalidEmailOrPhone',
  unauthorizedAccess = 'unauthorizedAccess',
  verificationCodeInvalid = 'verificationCodeInvalid',
  UnhandledError = 'Unhandled Error',
  locationRequired = 'locationRequired',
  outOfRegion = 'outOfRegion',
  limitViewsExceeded = 'limitViewsExceeded',
}

export interface IErrorResponse {
  error: {
    message: string;
    code: string;
  };
}

export enum ESendMessageMode {
  phone = 'phone',
  email = 'email',
}

export interface IAddressComponent {
  long_name: string;
  short_name: string;
  types: string[];
}

export interface IGeocodingResult {
  address_components: IAddressComponent[];
  formatted_address: string;
}

export interface IGeocodingResponse {
  results: IGeocodingResult[];
  status: string;
}

export interface IGetStripeSecretProperties {
  customerId: string;
  trialPeriodDays?: number;
}

export interface IManualEncryptionUserLimits {
  views: string[] | [];
  phoneVerification: string[] | [];
  locationLocked: string[] | [];
}

export interface ILocationDistance {
  lat: number;
  lng: number;
  distance: number;
  address: string;
}

export interface IPaymentCustomer {
  email: string;
  id: string;
  invoice_prefix: string;
  created: number;
}

export interface IManualEncryptionUserResponse {
  email: string;
  userId: string;
  isPayed: boolean;
  activeEncryptionKeyId: string;
  paymentIntentId: {
    id: string;
    date: Date;
  }[];
  limits: IManualEncryptionUserLimits;
  trialPeriodData?: {
    date?: string;
    isActivated?: boolean;
  };
  referralInvitationData?: {
    referralSenderId: string;
    referralId: string;
  };
  referralBonusPremium?: {
    activated: false;
    startDate?: Date;
  };
}

export interface IManualEncryptionUserProperties {
  userId: string;
  accountId?: string;
  email: string;
  displayName?: string;
  isPayed: boolean;
  paymentIntentId?: string;
  limits?: IManualEncryptionUserLimits;
  skipLimits?: boolean;
  trialPeriodData?: {
    date: string;
    isActivated: boolean;
  };
  privateKeyData:
    | {
        public: string;
        os?: string;
        browser?: string;
      }
    | {id: string; verification: string};
  referralInvitationData?: {
    referralSenderId: string;
    referralId: string;
  };
}

export interface IUpdateManualEncryptionUserProperties {
  accountId?: string;
  email: string;
  displayName?: string;
  isPayed: boolean;
  paymentIntentId?: string;
  limits?: IManualEncryptionUserLimits;
  skipLimits?: boolean;
  trialPeriodData?: {
    date: string;
    isActivated: boolean;
  };
  privateKeyData?:
    | {
        public: string;
        os?: string;
        browser?: string;
      }
    | {id: string; verification: string};
}

export interface IStripeProduct {
  id: string;
  object: string;
  active: boolean;
  created: number;
  default_price: null | number;
  description: null | string;
  features: string[];
  images: string[];
  livemode: boolean;
  metadata: Record<string, unknown>;
  name: string;
  package_dimensions: null | Record<string, unknown>;
  shippable: null | boolean;
  statement_descriptor: null | string;
  tax_code: null | string;
  unit_label: null | string;
  updated: number;
  url: null | string;
}

export interface IHttpExceptionResponse {
  statusCode: number;
  message: string | string[];
  error: string;
}
