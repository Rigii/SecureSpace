import React, {useEffect, useRef} from 'react';
// import {StatusBar} from 'react-native';
import SplashScreen from 'react-native-splash-screen';
import {sagaMiddleware, store} from './store/store';
import {Provider} from 'react-redux';
import Toast from 'react-native-toast-message';
import {Text, View} from 'react-native';
import {asyncStorageLogger} from '../services/custom-services';
import {ChatSocketProvider} from '../context/chat/chat-provider.context';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {applicationRoutes} from './navigator/screens';
import {NavigationContainer} from '@react-navigation/native';
import {SelectNavigationStack} from './navigator/select-navigation-stack';
import rootSaga from './store/saga/root.saga';
import {navigationService} from '../services/navigation/navigation.service';

/* For asyncStorage debugging */
(global as any).asyncStorageLogger = asyncStorageLogger;

function App(): React.JSX.Element {
  const navigationRef = useRef(null);

  useEffect(() => {
    SplashScreen.hide();
  }, []);

  const handleNavigationReady = () => {
    navigationService.setNavigationRef(navigationRef.current);
    sagaMiddleware.run(rootSaga);
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
