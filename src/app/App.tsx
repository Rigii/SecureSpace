import React, {useEffect} from 'react';
import {AppNavigationContainer} from './navigator/app.navigator';
// import {StatusBar} from 'react-native';
import SplashScreen from 'react-native-splash-screen';
import {setupStore} from './store/store';
import {Provider} from 'react-redux';

function App(): React.JSX.Element {
  useEffect(() => {
    SplashScreen.hide();
  }, []);

  const store = setupStore();

  return (
    <>
      <Provider store={store}>
        <AppNavigationContainer />
      </Provider>
    </>
  );
}

export default App;
