export interface IAEncryptionLimits {
  attachmentsNumberLimit: number;
  receiverPhoneVerificationsLimit: number;
  locationLockedLimit: number;
  messageReadCountLimit: number;
  trialPeriod: number;
  messageLocationRangeLimit: number;
  messageSymbolLimitFree: number;
  messageSymbolLimitPremium: number;
}
