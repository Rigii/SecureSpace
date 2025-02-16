import {createSlice} from '@reduxjs/toolkit';
import {updateManualEncryptionDataAction} from './updateManualEncryptionAction';
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
  },
});

export default manualEncryptionDataSlice.reducer;
