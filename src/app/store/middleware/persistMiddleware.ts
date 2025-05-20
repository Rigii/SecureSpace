import {createListenerMiddleware} from '@reduxjs/toolkit';
import {RootState} from '../store';
import {
  addPgpDeviceKeyData,
  setSecurityData,
} from '../state/userState/userAction';
import {
  ESecureStoredKeys,
  saveSecureStorageData,
} from '../../../services/async-secure-storage/secure-storage-services';
import {IUserState} from '../state/userState/userState.types';

const persistMiddleware = createListenerMiddleware();

const saveAnonymousUser = async (listenerApi: any) => {
  const state = listenerApi.getState() as RootState;

  try {
    await saveSecureStorageData<IUserState>({
      key: ESecureStoredKeys.anonymousUser,
      data: state.anonymousUserReducer,
    });
  } catch (error) {
    console.error('Error saving anonymous user to secure storage:', error);
  }
};

persistMiddleware.startListening({
  actionCreator: setSecurityData,
  effect: async (_, api) => saveAnonymousUser(api),
});

persistMiddleware.startListening({
  actionCreator: addPgpDeviceKeyData,
  effect: async (_, api) => saveAnonymousUser(api),
});

export default persistMiddleware;
