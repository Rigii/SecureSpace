import {createAction} from '@reduxjs/toolkit';
import {EAuthMode} from '../../../../screens/login-signup/login-sign-up.types';

export const loginRequestedSaga = createAction<{
  email: string;
  password: string;
  mode: EAuthMode;
  devicePrivateKey: string | null;
}>('authFlow/loginRequestedSaga');

export const loginSuccess = createAction('auth/loginSuccess');
export const loginFailed = createAction<string>('auth/loginFailed');

export const setRedirect = createAction<{
  screen: string;
  params?: Record<string, any>;
}>('auth/setRedirect');
