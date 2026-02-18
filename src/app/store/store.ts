import {combineReducers, configureStore} from '@reduxjs/toolkit';
import {TypedUseSelectorHook, useSelector} from 'react-redux';
import {persistReducer} from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';

import anonymousUserReducer from './state/user-state/user.slice';
import onboardingFormReducer from './state/onboarding-state/onboarding.slice';
import chatRoomsSlice from './state/chat-rooms-content/chat-rooms-slice';
import userChatAccountReducer from './state/user-chat-account/user-chat-account.slice';
import restrictionsReducer from './state/application-restrictions/restrictions.slice';
import manualEncryptionDataReducer from './state/manual-encryption/manual-encryption.slice';

import {IUserState} from './state/user-state/user-state.types';
import {IOnboardingFormValues} from './state/onboarding-state/onboarding-state.types';
import {IUserChatAccount} from './state/user-chat-account/user-chat-account.types';
import {IChatRooms} from './state/chat-rooms-content/chat-rooms-state.types';
import {IRestrictionsState} from './state/application-restrictions/restrictions.slice';
import {IManualEncryptionState} from './state/manual-encryption/types';
import createSagaMiddleware from 'redux-saga';
import persistMiddleware from './middleware/persistMiddleware';

export interface IState {
  chatRoomsSlice: IChatRooms;
  userChatAccountReducer: IUserChatAccount;
  anonymousUserReducer: IUserState;
  restrictionsReducer: IRestrictionsState;
  manualEncryptionDataReducer: IManualEncryptionState;
  onboardingFormReducer: IOnboardingFormValues;
}

const userChatAccountPersistConfig = {
  key: 'userChatAccount',
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
    userChatAccountPersistConfig,
    userChatAccountReducer,
  ),
  chatRoomsSlice: persistReducer(chatRoomsPersistConfig, chatRoomsSlice),
  anonymousUserReducer: persistReducer(
    anonymousUserPersistConfig,
    anonymousUserReducer,
  ),
  restrictionsReducer,
  manualEncryptionDataReducer,
  onboardingFormReducer,
});

const sagaMiddleware = createSagaMiddleware();

export const store = configureStore({
  reducer: rootReducer,
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: false,
    }).concat(persistMiddleware.middleware, sagaMiddleware),
  devTools: __DEV__,
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useReduxSelector: TypedUseSelectorHook<RootState> = useSelector;
export {sagaMiddleware};
