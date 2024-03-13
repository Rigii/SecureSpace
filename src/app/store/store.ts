import {combineReducers, configureStore} from '@reduxjs/toolkit';
import anonymousUserReducer from './state/userState/userSlice';
import restrictionsReducer from './state/applicationRestrictionsState/restrictionsSlice';
import paymentSettingsReducer from './state/paymentSettingsState/paymentSettingsSlice';
import manualEncryptionDataReducer from './state/manualEncryptionState/manualEncryptionSlice';

const rootReducer = combineReducers({
  anonymousUserReducer,
  restrictionsReducer,
  paymentSettingsReducer,
  manualEncryptionDataReducer,
});

export const setupStore = () =>
  configureStore({
    reducer: rootReducer,
    // middleware: getDefaultMiddleware => [...getDefaultMiddleware()],
  });

export type RootState = ReturnType<typeof rootReducer>;
export type AppStore = ReturnType<typeof setupStore>;
export type AppDispatch = AppStore['dispatch'];
