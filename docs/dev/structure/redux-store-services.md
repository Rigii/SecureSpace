# Redux Store and State Management

The app uses a synchronous Redux store setup.

## Used Packages

1. Redux Toolkit
2. Redux Saga
3. redux-persist

## Used Redux Features

- `configureStore` (reduxjs/toolkit)
- `combineReducers` (reduxjs/toolkit)
- `persistReducer` (redux-persist)
- `createSagaMiddleware` (redux-saga)
- `createListenerMiddleware` for `persistMiddleware` (reduxjs/toolkit)
- `useSelector` (react-redux)

## Configuration and Setup

The store configuration is implemented in the `store.ts` file.

- **_Creating / Applying AsyncStorage Data Object_**  
  Applying AsyncStorage-backed state to session storage using `persistReducer` by creating a key/storage configuration object (`userChatAccountPersistConfig`) and attaching it in `combineReducers`.

- **_Combining Reducers_**  
  Combining all reducers into a single `rootReducer` using `combineReducers` and applying it to the store via `configureStore`.

- **_Create Saga Middleware_**  
  Initializing `sagaMiddleware` using `createSagaMiddleware`.  
  This middleware is registered in `configureStore`, but all saga interceptors are started in `App.tsx` by running the root saga.

  **_NB:_** The root saga is started in `App.tsx` when navigation becomes ready,  
  as sagas depend on the navigation service being initialized.

- **_Import / Connect Persist Middleware (`persistMiddleware`)_**  
  A set of listener-based middlewares that update **_secure storage_** in the background when specific actions are dispatched (e.g. `setSecurityData`, `addPgpDeviceKeyData`).  
  It is imported into the store file and connected in `configureStore` together with other middlewares.  
  The middleware is preconfigured with all required listeners.

- **_Applying All Middlewares_**  
  Registering all middlewares (`persistMiddleware`, `sagaMiddleware`, etc.) in the `middleware` section of `configureStore`.

- **_Configure Store_**  
  Applying the final store configuration using `configureStore`.

- **_useReduxSelector – State Access for the App_**  
  Implementing and exporting a typed `useReduxSelector` hook based on `useSelector`.

## Middlewares

1. **Saga Middleware**  
   Created using `createSagaMiddleware`.

   - Runs asynchronous logic (API calls, timers, WebSockets)
   - Coordinates complex flows (sequences, retries, cancellation)
   - Keeps reducers pure and synchronous

2. **Persist Middleware**  
   A set of middlewares that update **_secure storage_** in the background when specific actions are dispatched  
   (listeners react to actions such as `setSecurityData`, `addPgpDeviceKeyData`).

## Applying AsyncStorage to the State

**_AsyncStorage_**  
Permanent state is applied to session storage using `persistReducer` by creating the `userChatAccountPersistConfig` key/storage configuration and attaching it in `combineReducers`.  
All reducers are combined into a single `rootReducer` and applied to the store via `configureStore`.

**_NB:_** Encrypted storage data (from `react-native-encrypted-storage`) is fetched asynchronously and applied inside the `rootSaga` due to its async nature.

## Sagas

1. **_Creating / Connecting / Running Saga Middleware_**  
   `sagaMiddleware` is initialized in the store file.  
   The middleware is registered in `configureStore`, but all saga interceptors are started in `App.tsx` by running the root saga.

   **_NB:_** The root saga is started in `App.tsx` when navigation becomes ready,  
   as sagas depend on the navigation service being initialized.

2. **_Root Saga_**  
   Defined in `root.saga.ts`, where all application sagas are combined and applied.

3. **_Encrypted Storage Saga_**  
   Defined in `encrypted-storage.saga.ts`, responsible for applying encrypted data to the state and updating it on changes in `react-native-encrypted-storage`.

4. **_Sign-Up / Auth Flow Saga_**  
   Defined in `auth.saga.ts`, handling step-by-step authentication and sign-up flows, including API calls, state updates, and navigation redirects.
