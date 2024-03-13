import {createAsyncThunk, createAction} from '@reduxjs/toolkit';
import {IEncryptionUser, IPaymentCustomer} from '../../../types/encrypt.types';

import AsyncStorage from '@react-native-async-storage/async-storage';

export const setIsActiveSubscription = createAction<boolean>(
  'anonymousUser/setIsActiveSubscription',
);

export const setIsTrialPeriodExpired = createAction<boolean>(
  'anonymousUser/isTrialPeriodExpired',
);

export const setIsMinimalUserDataLoading = createAction<boolean>(
  'anonymousUser/setIsMinimalUserDataLoading',
);

export const setIsAdditionalUserDataLoading = createAction<boolean>(
  'anonymousUser/isAdditionalUserDataLoading',
);

export const setShowPlanPage = createAction<boolean>(
  'anonymousUser/showPlanPage',
);

export const setAnonymousUser = createAction<Partial<IEncryptionUser> | null>(
  'anonymousUser/setAnonymousUser',
);

export const saveActualAnonymousUserData = createAsyncThunk(
  'anonymousUser/saveActualAnonymousUserData',
  async (
    {
      user,
      isCookiesAllowed,
    }: {
      user: Partial<IEncryptionUser> | null;
      isCookiesAllowed?: boolean;
    },
    {dispatch},
  ) => {
    try {
      const currentCookieStateJSON = await AsyncStorage.getItem(
        'manual-encryption-decryption-user',
      );

      const newCookieState = currentCookieStateJSON
        ? {...JSON.parse(currentCookieStateJSON), ...user}
        : user;

      if (isCookiesAllowed) {
        await AsyncStorage.setItem(
          'manual-encryption-decryption-user',
          JSON.stringify(newCookieState),
        );
      }

      // Dispatch the regular action creator to update the state
      dispatch(setAnonymousUser(user));
    } catch (error) {
      // Handle errors here
      console.error('Error saving user data:', error);
      // You can throw the error to handle it in the rejected case
      throw error;
    }
  },
);

export const savePaymentCustomer = createAction(
  'anonymousUser/savePaymentCustomer',
  ({paymentCustomer}: {paymentCustomer?: IPaymentCustomer}) => ({
    payload: paymentCustomer,
  }),
);

export const savePaymentCustomerError = createAction(
  'anonymousUser/savePaymentCustomer',
  ({errorString}: {errorString?: string}) => ({
    payload: errorString,
  }),
);
