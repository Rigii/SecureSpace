import {createListenerMiddleware} from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {RootState} from '../store';
import {setSecurityData} from '../state/userState/userAction';

const persistMiddleware = createListenerMiddleware();

persistMiddleware.startListening({
  actionCreator: setSecurityData,
  effect: async (action, listenerApi) => {
    const state = listenerApi.getState() as RootState;
    const anonymousUserData = state.anonymousUserReducer;

    try {
      await AsyncStorage.setItem(
        'anonymousUser',
        JSON.stringify(anonymousUserData),
      );
    } catch (error) {
      console.error('Error saving anonymous user to AsyncStorage:', error);
    }
  },
});

export default persistMiddleware;
