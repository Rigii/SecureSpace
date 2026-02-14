import React, {useEffect, useRef} from 'react';
import SplashScreen from 'react-native-splash-screen';
import {sagaMiddleware, store} from './store/store';
import {Provider} from 'react-redux';
import Toast from 'react-native-toast-message';
import {Text, View} from 'react-native';
import {asyncStorageLogger} from '../services/custom-services/custom-services';
import {ChatSocketProvider} from '../context/chat/chat-provider.context';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {applicationRoutes} from './navigator/screens';
import {NavigationContainer} from '@react-navigation/native';
import {SelectNavigationStack} from './navigator/select-navigation-stack';
import rootSaga from './store/saga/root.saga';
import {navigationService} from '../services/navigation/navigation.service';

/* For asyncStorage debugging */
(global as any).asyncStorageLogger = asyncStorageLogger;

// Type declaration for Webpack HMR
declare const module: any;

// Variable to hold the saga task reference
let sagaTask: ReturnType<typeof sagaMiddleware.run> | null = null;

function App(): React.JSX.Element {
  const navigationRef = useRef(null);

  useEffect(() => {
    SplashScreen.hide();

    // Start the saga
    startSaga();

    // Set up hot module replacement
    if (__DEV__ && module.hot) {
      module.hot.accept('./store/saga/root.saga', () => {
        console.info('[HMR] Reloading sagas...');

        if (sagaTask) {
          sagaTask.cancel();
          sagaTask.toPromise().finally(() => {
            const newRootSaga = require('./store/saga/root.saga').default;
            sagaTask = sagaMiddleware.run(newRootSaga);
          });
        }
      });
    }

    return () => {
      if (sagaTask) {
        sagaTask.cancel();
      }
    };
  }, []);

  const startSaga = () => {
    if (!sagaTask) {
      sagaTask = sagaMiddleware.run(rootSaga);
    }
  };

  const handleNavigationReady = () => {
    navigationService.setNavigationRef(navigationRef.current);
  };

  if (!store) {
    return (
      <View>
        <Text>...Spinner Here</Text>
      </View>
    );
  }

  return (
    <>
      <Provider store={store}>
        <ChatSocketProvider>
          <SafeAreaProvider>
            <NavigationContainer
              ref={navigationRef}
              onReady={handleNavigationReady}>
              <SelectNavigationStack
                redirectAuthRoute={applicationRoutes.registerLogin}
              />
            </NavigationContainer>
          </SafeAreaProvider>
        </ChatSocketProvider>
        <Toast />
      </Provider>
    </>
  );
}

export default App;
