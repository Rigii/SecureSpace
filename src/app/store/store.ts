import {combineReducers, configureStore} from '@reduxjs/toolkit';
import anonymousUserReducer from './state/userState/userSlice';
import restrictionsReducer, {
  IRestrictionsState,
} from './state/applicationRestrictionsState/restrictionsSlice';
import paymentSettingsReducer, {
  IPaymentSettings,
} from './state/paymentSettingsState/paymentSettingsSlice';
import manualEncryptionDataReducer from './state/manualEncryptionState/manualEncryptionSlice';
import {IManualEncryptionState} from './state/manualEncryptionState/types';
import {TypedUseSelectorHook, useSelector} from 'react-redux';
import {IUserState} from './state/userState/userState.types';
import {loadAnonymousUserData} from './asyncStorageHelpers';
import persistMiddleware from './middleware/persistMiddleware';

const rootReducer = combineReducers({
  anonymousUserReducer,
  restrictionsReducer,
  paymentSettingsReducer,
  manualEncryptionDataReducer,
});

export const setupStore = async () => {
  const anonymousUserData = await loadAnonymousUserData();

  return configureStore({
    reducer: rootReducer,
    preloadedState: {
      anonymousUserReducer: anonymousUserData || undefined, // Предзагрузка состояния
    },
    middleware: getDefaultMiddleware =>
      getDefaultMiddleware().concat(persistMiddleware.middleware),
    // middleware: getDefaultMiddleware => [...getDefaultMiddleware()],
  });
};

export interface IState {
  anonymousUserReducer: IUserState;
  restrictionsReducer: IRestrictionsState;
  paymentSettingsReducer: IPaymentSettings;
  manualEncryptionDataReducer: IManualEncryptionState;
}

export const useReduxSelector: TypedUseSelectorHook<IState> = useSelector;

export type RootState = ReturnType<typeof rootReducer>;
export type AppStore = Awaited<ReturnType<typeof setupStore>>;
export type AppDispatch = AppStore['dispatch'];

// return configureStore({
//   reducer: rootReducer,
//   preloadedState: {
//     anonymousUserReducer: anonymousUserData || undefined, // Предзагрузка состояния
//   },
//   middleware: getDefaultMiddleware => getDefaultMiddleware().concat(persistMiddleware.middleware),
// });
