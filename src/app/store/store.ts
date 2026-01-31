import {combineReducers, configureStore} from '@reduxjs/toolkit';
import {TypedUseSelectorHook, useSelector} from 'react-redux';
import createSagaMiddleware from 'redux-saga';
import {persistReducer} from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';

import rootSaga from './saga/root.saga';

import anonymousUserReducer from './state/userState/userSlice';
import onboardingFormReducer from './state/onboardingState/onboardingSlice';
import chatRoomsReducer from './state/chatRoomsContent/chatRoomsSlice';
import userChatAccountReducer from './state/userChatAccount/userChatAccountSlice';
import restrictionsReducer from './state/applicationRestrictions/restrictionsSlice';
import manualEncryptionDataReducer from './state/manualEncryption/manualEncryptionSlice';

import {IUserState} from './state/userState/userState.types';
import {IOnboardingFormValues} from './state/onboardingState/onboardingStateTypes';
import {IUserChatAccount} from './state/userChatAccount/userChatAccount.types';
import {IChatRooms} from './state/chatRoomsContent/chatRoomsState.types';
import {IRestrictionsState} from './state/applicationRestrictions/restrictionsSlice';
import {IManualEncryptionState} from './state/manualEncryption/types';

import persistMiddleware from './middleware/persistMiddleware';

export interface IState {
  chatRoomsReducer: IChatRooms;
  userChatAccountReducer: IUserChatAccount;
  anonymousUserReducer: IUserState;
  restrictionsReducer: IRestrictionsState;
  manualEncryptionDataReducer: IManualEncryptionState;
  onboardingFormReducer: IOnboardingFormValues;
}

const sagaMiddleware = createSagaMiddleware();

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
  chatRoomsReducer: persistReducer(chatRoomsPersistConfig, chatRoomsReducer),
  anonymousUserReducer: persistReducer(
    anonymousUserPersistConfig,
    anonymousUserReducer,
  ),
  restrictionsReducer,
  manualEncryptionDataReducer,
  onboardingFormReducer,
});

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
export {sagaMiddleware, rootSaga};
