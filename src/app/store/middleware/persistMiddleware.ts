import {createListenerMiddleware} from '@reduxjs/toolkit';
import {RootState} from '../store';
import {setSecurityData} from '../state/userState/userAction';
import {
  ESecureStoredKeys,
  saveSecureStorageData,
} from '../../../services/async-secure-storage/secure-storage-services';
import {IUserState} from '../state/userState/userState.types';

const persistMiddleware = createListenerMiddleware();

persistMiddleware.startListening({
  actionCreator: setSecurityData,
  effect: async (action, listenerApi) => {
    const state = listenerApi.getState() as RootState;
    const anonymousUserData = state.anonymousUserReducer;

    try {
      await saveSecureStorageData<IUserState>({
        key: ESecureStoredKeys.anonymousUser,
        data: anonymousUserData,
      });
    } catch (error) {
      console.error('Error saving anonymous user to AsyncStorage:', error);
    }
  },
});

export default persistMiddleware;
