import {createAsyncThunk} from '@reduxjs/toolkit';
import {strings} from '../../../../constants/strings/encryption-decryption.strings';
import {locallyManualEncryptionDecryptionRestrictions} from '../../../../services/async-storage/async-storage-service';
// import {GetApplicationRestrictions} from '../../../../utilities/functionsAdapter/functionsAdapter';

const GeMockedApplicationRestrictions = () => ({
  encryption: {
    attachmentsNumberLimit: 3,
    receiverPhoneVerificationsLimit: 3,
    locationLockedLimit: 3,
    messageReadCountLimit: 3,
    trialPeriod: 3,
    messageLocationRangeLimit: 3,
    messageSymbolLimitFree: 3,
    messageSymbolLimitPremium: 3,
  },
});

export const fetchApplicationRestrictions = createAsyncThunk(
  'appRestrictions/fetchRestrictions',
  async (navigateToErrorScreen: () => void, thunkAPI) => {
    try {
      const restrictions = await GeMockedApplicationRestrictions();
      if (!restrictions?.encryption) {
        return null;
      }

      restrictions &&
        locallyManualEncryptionDecryptionRestrictions.set(
          restrictions.encryption,
        );
      return restrictions?.encryption;
    } catch {
      thunkAPI.rejectWithValue(strings.gettingRestrictionsError);
      return navigateToErrorScreen();
    }
  },
);
