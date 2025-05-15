import {createAction} from '@reduxjs/toolkit';
import {ISecurityData, IUserAccount} from './userState.types';

export const setUser = createAction<Partial<IUserAccount> | null>(
  'anonymousUser/setAnonymousUser',
);

export const setSecurityData = createAction<Partial<ISecurityData> | null>(
  'anonymousUser/setSecurityData',
);

export const clearUser = createAction('anonymousUser/clearUser');

export const addPgpDeviceKeyData = createAction<Partial<ISecurityData> | null>(
  'anonymousUser/addPgpDeviceKeyData',
);

export const logOut = createAction('anonymousUser/logOut');
