import React, {useEffect} from 'react';
import {AppNavigationContainer} from './app.navigator';
// import {StatusBar} from 'react-native';
import SplashScreen from 'react-native-splash-screen';

function App(): React.JSX.Element {
  useEffect(() => {
    SplashScreen.hide();
  }, []);

  return (
    <>
      <AppNavigationContainer />
    </>
  );
}

export default App;
