import React, {useEffect, useState} from 'react';
import {AppNavigationContainer} from './navigator/app.navigator';
// import {StatusBar} from 'react-native';
import SplashScreen from 'react-native-splash-screen';
import {AppStore, setupStore} from './store/store';
import {Provider} from 'react-redux';
import Toast from 'react-native-toast-message';
import {Text, View} from 'react-native';
import {asyncStorageLogger} from '../services/custom-services';
import {ChatSocketProvider} from '../services/context/chat/chat-context-provider';

(global as any).asyncStorageLogger = asyncStorageLogger; // For asyncStorage debugging

function App(): React.JSX.Element {
  const [store, setStore] = useState<AppStore | null>(null);

  useEffect(() => {
    const initializeStore = async () => {
      const appStore = await setupStore();
      setStore(appStore);
    };

    initializeStore();
  }, []);

  useEffect(() => {
    SplashScreen.hide();
  }, []);

  if (!store) {
    // TODO: Create and use Loading screen with Spinner
    // Create a HOC and drop spinner toggle finc into child components with Context
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
          <AppNavigationContainer />
        </ChatSocketProvider>
        <Toast />
      </Provider>
    </>
  );
}

export default App;
