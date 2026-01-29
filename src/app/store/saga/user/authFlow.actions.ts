import {createAction} from '@reduxjs/toolkit';

export const loginRequested = createAction<{
  email: string;
  password: string;
  mode: 'signIn' | 'signUp';
  devicePrivateKey: string | null;
}>('authFlow/loginRequested');

export const loginSuccess = createAction('auth/loginSuccess');
export const loginFailed = createAction<string>('auth/loginFailed');

export const setRedirect = createAction<{
  screen: string;
  params?: Record<string, any>;
}>('auth/setRedirect');
