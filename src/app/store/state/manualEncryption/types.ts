import {
  EExpiry,
  LocationDistance,
} from "ManualEncryptionDecryption/encrypt.types";
import { TwoFactor } from "../../../../../adapters/firebase-adapter";

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
  locationRange?: LocationDistance;
}
