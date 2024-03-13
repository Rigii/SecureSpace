import {createSlice} from '@reduxjs/toolkit';
import {fetchPaymentSettings} from './paymentSettingsAction';
import {IAEncryptionPaymentSettings} from './payment-settings.types';

interface UserState {
  paymentSettings: IAEncryptionPaymentSettings | null | {};
  isSettingsLoading: boolean;
  settingsError: string;
}

const initialState: UserState = {
  paymentSettings: null,
  isSettingsLoading: false,
  settingsError: '',
};

export const paymentSettingsSlice = createSlice({
  name: 'paymentSettings',
  initialState: initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(fetchPaymentSettings.fulfilled, (state, action) => {
        state.isSettingsLoading = false;
        state.settingsError = '';
        state.paymentSettings = action.payload;
      })
      .addCase(fetchPaymentSettings.pending, state => {
        if (state.paymentSettings !== null) {
          return;
        }
        state.isSettingsLoading = true;
      })
      .addCase(fetchPaymentSettings.rejected, (state, action) => {
        state.isSettingsLoading = false;
        state.settingsError = action.payload as string;
      });
  },
});

export default paymentSettingsSlice.reducer;
