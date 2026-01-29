import {combineReducers, configureStore} from '@reduxjs/toolkit';
import {persistReducer} from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';
import anonymousUserReducer from './state/userState/userSlice';
import onboardingFormReducer from './state/onboardingState/onboardingSlice';
import chatRoomsReducer from './state/chatRoomsContent/chatRoomsSlice';
import userChatAccountReducer from './state/userChatAccount/userChatAccountSlice';
import restrictionsReducer, {
  IRestrictionsState,
} from './state/applicationRestrictions/restrictionsSlice';
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
import {IUserChatAccount} from './state/userChatAccount/userChatAccount.types';
import {IChatRooms} from './state/chatRoomsContent/chatRoomsState.types';
import createSagaMiddleware from 'redux-saga';

const sagaMiddleware = createSagaMiddleware();

const userChatsPersistConfig = {
  key: 'userChats',
  storage: AsyncStorage,
};

const chatRoomsPersistConfig = {
  key: 'chatRooms',
  storage: AsyncStorage,
};

const anonymousUserPersistConfig = {
  key: 'anonymousUser',
  storage: AsyncStorage,
};

const rootReducer = combineReducers({
  userChatAccountReducer: persistReducer(
    userChatsPersistConfig,
    userChatAccountReducer,
  ),
  chatRoomsReducer: persistReducer(chatRoomsPersistConfig, chatRoomsReducer),
  anonymousUserReducer: persistReducer(
    anonymousUserPersistConfig,
    anonymousUserReducer,
  ),
  restrictionsReducer,
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
        sagaMiddleware,
      ),
  });
};

export interface IState {
  chatRoomsReducer: IChatRooms;
  userChatAccountReducer: IUserChatAccount;
  anonymousUserReducer: IUserState;
  restrictionsReducer: IRestrictionsState;
  manualEncryptionDataReducer: IManualEncryptionState;
  onboardingFormReducer: IOnboardingFormValues;
}

export const useReduxSelector: TypedUseSelectorHook<IState> = useSelector;

export type RootState = ReturnType<typeof rootReducer>;
export type AppStore = Awaited<ReturnType<typeof setupStore>>;
export type AppDispatch = AppStore['dispatch'];
