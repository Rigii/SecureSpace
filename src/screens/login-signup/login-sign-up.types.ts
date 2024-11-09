// import {UserCredential, User as IAuthUser} from 'firebase/auth';
// import {Key} from '../../adapters/firebase-adapter';
import {IErrorResponse} from '../../services/xhr-services/xhr.types';

// export type TKeys = Array<Key>;
export type TKeys = Array<{}>;
export interface IPopupAuthResult {
  // TODO: Install Firebase and use this types: extends UserCredential {
  providerId: TLoginMode;
  user: User;
  _tokenResponse?: {
    oauthAccessToken: string;
    idToken: string;
    refreshToken: string;
    email: string;
    localId: string;
    providerId: TLoginMode;
  };
}

export interface IUserCheckAndSign {
  // TODO: Install Firebase and use this types:extends IAuthUser {
  microsoftAuthData?: IMicrosoftAuthData;
  accessToken?: string;
}

export interface IMicrosoftAuthData {
  oauthAccessToken: string;
  refreshToken: string;
  email: string;
  localId: string;
  error?: string;
}

export interface User {
  // TODO: Install Firebase and use this types:extends IAuthUser { extends IAuthUser {
  accountId: string;
  accessToken?: string;
  displayName: string;
  email: string;
  token?: string;
  phone?: string;
  team?: Array<{
    id: string;
    name: string;
    role?: string;
    portraitUri?: string;
  }>;
  manualSignAndSend?: boolean;
  key?: {private: string; id: string; email?: string};
  keys?: TKeys;
  loggedInKeys?: TKeys;
  active?: boolean;
  isSystemAdmin?: boolean;
  loginMode?: TLoginMode;
  icon?: string;
  portraitUri?: string;
  microsoftAuthData?: IMicrosoftAuthData;
}

export type TLoginMode = 'emailLink' | 'google.com' | 'microsoft.com';

export enum ELoginMode {
  emailLink = 'emailLink',
  googleAuth = 'google.com',
  microsoftAuth = 'microsoft.com',
}

export interface ITeam {
  id: string;
  name: string;
  role?: string;
  icon?: string;
  portraitUri?: string;
}

export enum EConfirmErrors {
  name = 'name',
  email = 'email',
  phoneNumber = 'phoneNumber',
}

export interface TwoFactor {
  [email: string]: {type: 'phone'; target: string} | {type: 'email'};
}

export const SigningMarker = `\u200E\u200F\u200E\u200F\u200C\u200C`;

export type TGenerate2faCodeReturn =
  | {
      code: boolean;
      verifier: string;
      passcode?: true;
      sender?: string;
      sendReceipt?: boolean;
      target: string;
      createdAt: number | Date | undefined;
    }
  | IErrorResponse
  | {
      messageId: string;
      verifier: string;
      code?: string | undefined;
      email: string;
      onlyEventData?: boolean | undefined;
      sender?: string;
      sendReceipt?: boolean;
      createdAt: number | Date | undefined;
    };

export enum EActionTypes {
  setAccountDetails = 'setAccountDetails',
  verifyDetails = 'verifyDetails',
  setTeamName = 'setTeamName',
  previousStage = 'previousStage',
  nextStage = 'nextStage',
}

export interface IUseCreateAccount {
  accountId: string;
  requiresVerification: boolean;
  email: string;
  displayName: string;
  teamName: string;
  teamId: string;
  loginMode?: TLoginMode;
  microsoftAuthData?: IMicrosoftAuthData;
  phone?: string;
  isUserOnboardPassed: boolean;
  setState: React.Dispatch<Action>;
  onSetAccountDetails: (details: ISetAccountDetails | void) => void;
}

export enum Stages {
  VerifyNames = 0,
  CreateTeam = 1,
  SendInvites = 2,
}

export interface State {
  accountId: string;
  displayName: string;
  email: string;
  teamName: string;
  teamId: string;
  requiresVerification: boolean;
  loginMode?: TLoginMode;
  microsoftAuthData?: IMicrosoftAuthData;
  phone?: string;
}

export interface ISetAccountDetails {
  accountId: string;
  newUser: boolean;
  displayName: string;
  email: string;
  loginMode?: TLoginMode;
  microsoftAuthData?: IMicrosoftAuthData;
  phone?: string;
}

export type Action =
  | {
      microsoftAuthData?: IMicrosoftAuthData | undefined;
      type: EActionTypes.setAccountDetails;
      accountId: string;
      displayName: string;
      newUser: boolean;
      email: string;
      loginMode?: TLoginMode;
      phone?: string;
    }
  | {
      type: EActionTypes.verifyDetails;
      displayName: string;
      phone?: string;
    }
  | {
      type: EActionTypes.setTeamName;
      teamId: string;
      teamName: string;
    }
  | {type: EActionTypes.previousStage}
  | {type: EActionTypes.nextStage};

export interface IRegisterAnonymousUserState {
  currentStrings: {
    [key: string]: string;
  };
  isEmailValid: boolean;
  email: string;
  password: string;
  emailPasswordStep: boolean;
  setStep: () => void;
  emailSignUp: () => void;
  onChangeMode: (value: string) => any;
  setEmail: React.Dispatch<React.SetStateAction<string>>;
  setPassword: React.Dispatch<React.SetStateAction<string>>;
}

export enum EAuthMode {
  resetPassword = 'resetPassword',
  logIn = 'log-in',
  signUp = 'signUp',
}

export interface ILoginFormValues {
  email: string;
  password: string;
}

export interface IUserAuthData {
  password: string;
  id: string;
  created: Date;
  updated: Date;
  role: string;
  email: string;
  provider: string;
  externalAuthProviderId: string;
  emailVerified: boolean;
  userInfo: Record<string, string | string[]> | null;
}
