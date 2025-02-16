import {combineReducers, configureStore} from '@reduxjs/toolkit';
import {persistReducer} from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';
import anonymousUserReducer from './state/userState/userSlice';
import onboardingFormReducer from './state/onboardingState/onboardingSlice';
import userChatsReducer from './state/userChats/userChatsSlice';
import restrictionsReducer, {
  IRestrictionsState,
} from './state/applicationRestrictions/restrictionsSlice';
import paymentSettingsReducer, {
  IPaymentSettings,
} from './state/paymentSettings/paymentSettingsSlice';
import manualEncryptionDataReducer from './state/manualEncryption/manualEncryptionSlice';
import {IManualEncryptionState} from './state/manualEncryption/types';
import {TypedUseSelectorHook, useSelector} from 'react-redux';
import {IUserState} from './state/userState/userState.types';
import persistMiddleware from './middleware/persistMiddleware';
import {
  ESecureStoredKeys,
  getSecureStorageData,
} from '../../services/async-secure-storage/secure-storage-services';
import {IOnboardingFormValues} from './state/onboardingState/onboardingStateTypes';
import {IUserChats} from './state/userChats/userChatsState.types';

const chatPersistConfig = {
  key: 'chat',
  storage: AsyncStorage,
};

const rootReducer = combineReducers({
  userChatsReducer: persistReducer(chatPersistConfig, userChatsReducer),
  anonymousUserReducer,
  restrictionsReducer,
  paymentSettingsReducer,
  manualEncryptionDataReducer,
  onboardingFormReducer,
});

export const setupStore = async () => {
  const anonymousUserData = await getSecureStorageData(
    ESecureStoredKeys.anonymousUser,
  );

  return configureStore({
    reducer: rootReducer,
    preloadedState: {
      anonymousUserReducer: anonymousUserData || undefined, // Load user data from secure storage
    },
    middleware: getDefaultMiddleware =>
      getDefaultMiddleware({serializableCheck: false}).concat(
        persistMiddleware.middleware,
      ),
  });
};

export interface IState {
  userChatsReducer: IUserChats;
  anonymousUserReducer: IUserState;
  restrictionsReducer: IRestrictionsState;
  paymentSettingsReducer: IPaymentSettings;
  manualEncryptionDataReducer: IManualEncryptionState;
  onboardingFormReducer: IOnboardingFormValues;
}

export const useReduxSelector: TypedUseSelectorHook<IState> = useSelector;

export type RootState = ReturnType<typeof rootReducer>;
export type AppStore = Awaited<ReturnType<typeof setupStore>>;
export type AppDispatch = AppStore['dispatch'];
