# Navigation

The app uses the `@react-navigation/native` package.
It has two navigation stacks:

## 1. Auth Stack

- Register / Login screen
- Onboarding screen

## 2. Application Stack

- Home screen
- Chat List screen
- Create Chat Room screen
- Chat Room screen
- Account Settings screen
- Upload Key screen

**SelectNavigationStack** monitors the presence of:

- an authentication token
- onboarding completion

## Navigation Service

A navigation service is implemented to allow navigation usage within Redux Saga flows.  
**_NB!_** Inside app components, the native `@react-navigation/native` hooks are used.

The navigation service is initialized in the root `App` component before `sagaMiddleware` is run, once navigation becomes ready.

```ts
const handleNavigationReady = () => {
  sagaMiddleware.run(rootSaga);
};

<NavigationContainer ref={navigationRef} onReady={handleNavigationReady}>
  <SelectNavigationStack redirectAuthRoute={applicationRoutes.registerLogin} />
</NavigationContainer>;
```
