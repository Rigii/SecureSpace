import {TwoFactor} from '../../../../screens/login-signup/login-sign-up.types';
import {ILocationDistance} from '../../../../services/xhr-services/xhr.types';
import {EExpiry} from '../../../types/encrypt.types';

export interface IManualEncryptionState {
  receivers: string;
  textMessage: string;
  encryptedText: string;
  passcode: string;
  expiry: EExpiry;
  destroyOnRead: boolean;
  twoFactor: TwoFactor;
  is2fa: boolean;
  isExpirationNotification: boolean;
  isReceipts: boolean;
  locationRange?: ILocationDistance;
}
