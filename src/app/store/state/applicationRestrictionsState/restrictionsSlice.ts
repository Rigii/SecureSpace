import {createSlice} from '@reduxjs/toolkit';
import {fetchApplicationRestrictions} from './restrictionAction';
import {IAEncryptionLimits} from './application-restrictions.types';

interface IUserState {
  applicationRestrictions: IAEncryptionLimits | null | void;
  isRestrictionsLoading: boolean;
  restrictionsError: string;
}

const initialState: IUserState = {
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
      });
  },
});

export default applicationRestrictionsSlice.reducer;
