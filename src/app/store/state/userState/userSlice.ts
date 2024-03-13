import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {
  setIsMinimalUserDataLoading,
  setIsAdditionalUserDataLoading,
  setAnonymousUser,
  setIsTrialPeriodExpired,
  setIsActiveSubscription,
  setShowPlanPage,
} from './userAction';
import {IEncryptionUser} from '../../../types/encrypt.types';

interface UserState {
  anonymousUser: IEncryptionUser | null;
  isMinimalUserDataLoading: boolean;
  isAdditionalDataLoading: boolean;
  anonymousUserError: string;
  paymentCustomerLoadingError: string;
  isTrialPeriodExpired: boolean;
  isActiveSubscription: boolean;
  showPlanPage: boolean;
}

const initialState: UserState = {
  anonymousUser: null,
  isMinimalUserDataLoading: true,
  isAdditionalDataLoading: false,
  anonymousUserError: '',
  paymentCustomerLoadingError: '',
  isTrialPeriodExpired: false,
  isActiveSubscription: false,
  showPlanPage: false,
};

export const anonymousUserSlice = createSlice({
  name: 'anonymousUser',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(
        setAnonymousUser,
        (state, action: PayloadAction<Partial<IEncryptionUser> | null>) => {
          const currentState = state.anonymousUser?.accountId
            ? {...state.anonymousUser, ...action.payload}
            : action.payload;
          state.anonymousUser = currentState as IEncryptionUser;
        },
      )
      .addCase(
        setIsMinimalUserDataLoading,
        (state, action: PayloadAction<boolean>) => {
          state.isMinimalUserDataLoading = action.payload;
        },
      )
      .addCase(
        setIsAdditionalUserDataLoading,
        (state, action: PayloadAction<boolean>) => {
          state.isAdditionalDataLoading = action.payload;
        },
      )
      .addCase(
        setIsTrialPeriodExpired,
        (state, action: PayloadAction<boolean>) => {
          state.isTrialPeriodExpired = action.payload;
        },
      )
      .addCase(
        setIsActiveSubscription,
        (state, action: PayloadAction<boolean>) => {
          state.isActiveSubscription = action.payload;
        },
      )
      .addCase(setShowPlanPage, (state, action: PayloadAction<boolean>) => {
        state.showPlanPage = action.payload;
      });
  },
});

export default anonymousUserSlice.reducer;
