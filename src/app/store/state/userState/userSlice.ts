import {PayloadAction, createSlice} from '@reduxjs/toolkit';
import {
  IDeviceKeyData,
  ISecurityData,
  IUserAccount,
  IUserState,
} from './userState.types';
import {
  setUser,
  setSecurityData,
  logOut,
  clearUser,
  addPgpDeviceKeyData,
} from './userAction';

const initialState: IUserState = {
  userAccountData: {
    id: '',
    role: '',
    created: null,
    isOnboardingDone: false,
    email: '',
    token: '',
    portraitUri: '',
    title: '',
    name: '',
  },
  securityData: {
    accessCredentials: [],
    securePlaces: [],
    deviceIdentifyer: {
      os: '',
      date: null,
    },
    pgpDeviceKeyData: {
      devicePrivateKey: '',
      keyUUID: '',
      date: null,
      email: '',
      approved: false,
    },
  },
};

export const anonymousUserSlice = createSlice({
  name: 'anonymousUser',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder.addCase(
      setUser,
      (state, action: PayloadAction<Partial<IUserAccount> | null>) => {
        const newUser = {
          ...state.userAccountData,
          ...action.payload,
        };

        state.userAccountData = newUser;
      },
    );

    builder.addCase(
      addPgpDeviceKeyData,
      (state, action: PayloadAction<IDeviceKeyData>) => {
        state.securityData = {
          ...state.securityData,
          pgpDeviceKeyData: action.payload,
        };
      },
    );

    builder.addCase(clearUser, () => {
      return initialState;
    });

    builder.addCase(
      setSecurityData,
      (state, action: PayloadAction<Partial<ISecurityData> | null>) => {
        const newAccessCredentials = action.payload?.accessCredentials || [];
        const newSecurePlaces = action.payload?.securePlaces || [];
        const newDeviceIdentifyer = action.payload?.deviceIdentifyer || {};
        const newPgpKeysData = action.payload?.pgpDeviceKeyData || {};

        const newSecurityData = {
          accessCredentials: [
            ...state.securityData.accessCredentials,
            ...newAccessCredentials,
          ],
          securePlaces: [
            ...state.securityData.securePlaces,
            ...newSecurePlaces,
          ],
          deviceIdentifyer: {
            ...state.securityData.deviceIdentifyer,
            ...newDeviceIdentifyer,
          },
          pgpDeviceKeyData: {
            ...state.securityData.pgpDeviceKeyData,
            ...newPgpKeysData,
          },
        };
        state.securityData = newSecurityData;
      },
    );

    builder.addCase(logOut, state => {
      state.userAccountData = initialState.userAccountData;
    });
  },
});

export default anonymousUserSlice.reducer;
