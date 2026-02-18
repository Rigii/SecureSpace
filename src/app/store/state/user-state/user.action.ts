import {createAction} from '@reduxjs/toolkit';
import {IDeviceKeyData, ISecurityData, IUserAccount} from './user-state.types';

export const setUser = createAction<Partial<IUserAccount> | null>(
  'anonymousUser/setAnonymousUser',
);

export const setSecurityData = createAction<Partial<ISecurityData> | null>(
  'anonymousUser/setSecurityData',
);

export const clearUser = createAction('anonymousUser/clearUser');

export const addPgpDeviceKeyData = createAction<IDeviceKeyData>(
  'anonymousUser/addPgpDeviceKeyData',
);

export const logOut = createAction('anonymousUser/logOut');
