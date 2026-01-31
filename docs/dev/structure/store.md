# Redux Store and State Management

The app uses a synchronous Redux store setup.

## Used packages:

1. Redux Toolkit
2. Redux Saga
3. redux-persist

## Used Redux Features

- `configureStore` (reduxjs/toolkit)
- `combineReducers` (reduxjs/toolkit)
- `persistReducer` (redux-persist)
- `createSagaMiddleware` (redux-saga)
- `createListenerMiddleware` in persistMiddleware (reduxjs/toolkit)
- `useSelector` (react-redux)

## Configuration and apply

The store configuratin is implemented in `store.ts` file.

- **_AsyncStorage_** Applying permanent state to the session storage using `persistReducer` by creating key/storage `userChatAccountPersistConfig` object and setting in in `combineReducers`.
- Combining Reducers with `combineReducers` to single `rootReducer` and applying it to store in the `configureStore`
- Saga Middleware. Creating sagaMiddleware with `createSagaMiddleware`.
- Persist Middleware (persistMiddleware). persistMiddleware. The list of middlewares what are updates in background **_secure storage_** on calling some actions etc.(Listeners listern actions "setSecurityData", "addPgpDeviceKeyData"...).
- Applying Middlewares. Applying Middlewares (persistMiddleware, sagaMiddleware...) in `configureStore` in `middleware`.
- Configure Store. implementing final configurations in `configureStore`
- State access for the app. Implementing and exporting typed `useReduxSelector` hook with `useSelector`.

## The middlewares

1. Saga Middleware. Saga Middleware created with `createSagaMiddleware`.

- run asynchronous logic (API calls, timers, WebSockets)
- coordinate complex flows (sequences, retries, cancellation)
- keep reducers pure and synchronous

2. Persist Middleware.
   The list of middlewares what are updates in background **_secure storage_** on calling some actions etc.(Listeners listern actions "setSecurityData", "addPgpDeviceKeyData"...).

## Applying AsyncStorage to the state.

**_AsyncStorage_** Applying permanent state to the session storage using `persistReducer` by creating key/storage `userChatAccountPersistConfig` object and setting in in `combineReducers`.
Combining Reducers with `combineReducers` to single `rootReducer` and applying it to store in the `configureStore`

**_NB!_** Encrypted storage data (from `react-native-encrypted-storage`) fetched asynchroniousley and applyed in `rootSaga` due to async behaviour.
