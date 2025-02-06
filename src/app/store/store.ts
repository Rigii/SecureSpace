import {combineReducers, configureStore} from '@reduxjs/toolkit';
import anonymousUserReducer from './state/userState/userSlice';
import onboardingFormReducer from './state/onboardingState/onboardingSlice';
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
import persistMiddleware from './middleware/persistMiddleware';
import {
  ESecureStoredKeys,
  getSecureStorageData,
} from '../../services/async-secure-storage/secure-storage-services';
import {IOnboardingFormValues} from './state/onboardingState/onboardingStateTypes';

const rootReducer = combineReducers({
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
  onboardingFormReducer: IOnboardingFormValues;
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
