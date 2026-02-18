import {createSlice} from '@reduxjs/toolkit';
import {
  clearRestrictions,
  fetchApplicationRestrictions,
} from './restrictions.actions';
import {IAEncryptionLimits} from './application-restrictions.types';

export interface IRestrictionsState {
  applicationRestrictions: IAEncryptionLimits | null | void;
  isRestrictionsLoading: boolean;
  restrictionsError: string;
}

const initialState: IRestrictionsState = {
  applicationRestrictions: null,
  isRestrictionsLoading: false,
  restrictionsError: '',
};

export const applicationRestrictionsSlice = createSlice({
  name: 'encryptionRestrictions',
  initialState: initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(fetchApplicationRestrictions.fulfilled, (state, action) => {
        state.isRestrictionsLoading = false;
        state.restrictionsError = '';
        state.applicationRestrictions = action.payload;
      })
      .addCase(fetchApplicationRestrictions.pending, state => {
        if (state.applicationRestrictions !== null) {
          return;
        }
        state.isRestrictionsLoading = true;
      })
      .addCase(fetchApplicationRestrictions.rejected, (state, action) => {
        state.isRestrictionsLoading = false;
        if (state.applicationRestrictions !== null) {
          return;
        }
        state.restrictionsError = action.payload as string;
      })
      .addCase(clearRestrictions, () => {
        return initialState;
      });
  },
});

export default applicationRestrictionsSlice.reducer;
