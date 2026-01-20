import * as React from 'react';
import {
  NavigationContainer,
  useNavigationContainerRef,
} from '@react-navigation/native';
import {manualEncryptionScreenRoutes} from './screens';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {SelectNavigationStack} from './select-navigation-stack';

export const AppNavigationContainer = () => {
  const navigationRef = useNavigationContainerRef();

  return (
    <SafeAreaProvider>
      <NavigationContainer ref={navigationRef}>
        <SelectNavigationStack
          redirectAuthRoute={manualEncryptionScreenRoutes.registerLogin}
        />
      </NavigationContainer>
    </SafeAreaProvider>
  );
};
