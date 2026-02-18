import {createSlice} from '@reduxjs/toolkit';
import {
  clearEncryptionData,
  updateManualEncryptionDataAction,
} from './manual-encryption.actions';
import {IManualEncryptionState} from './types';
import {EExpiry} from '../../../types/encrypt.types';

const initialState: IManualEncryptionState = {
  textMessage: '',
  receivers: '',
  encryptedText: '',
  passcode: '',
  expiry: EExpiry.oneWeek,
  destroyOnRead: false,
  twoFactor: {},
  is2fa: false,
  isExpirationNotification: false,
  isReceipts: false,
  locationRange: undefined,
};

export const manualEncryptionDataSlice = createSlice({
  name: 'manualEncryptionData',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder.addCase(updateManualEncryptionDataAction, (state, action) => {
      return {...state, ...action.payload};
    });
    builder.addCase(clearEncryptionData, () => {
      return initialState;
    });
  },
});

export default manualEncryptionDataSlice.reducer;
