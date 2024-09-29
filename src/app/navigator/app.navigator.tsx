import * as React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {AppTestComponent} from '../AppTestComponent';
import {PrivateRoute} from './PrivateRoute';
import {manualEncryptionScreenRoutes} from './screens';
import {LoginSignUpUser} from '../../screens/login-signup/login-signup.screen';
import {OnboardingFlow} from '../../screens/onboarding/onboarding-flow';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

export const Home = () => (
  <Tab.Navigator>
    <Tab.Screen name="Feed" component={AppTestComponent} />
  </Tab.Navigator>
);

export const AppNavigationContainer = () => {
  const isAuthenticated = false;

  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name={manualEncryptionScreenRoutes.root}>
          {props => (
            <PrivateRoute
              {...props}
              isAuthenticated={isAuthenticated}
              redirectAuthRoute={
                manualEncryptionScreenRoutes.registerLoginRoute
              }
              component={Home}
            />
          )}
        </Stack.Screen>
        <Stack.Screen
          name={manualEncryptionScreenRoutes.homeRoute}
          component={Home}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name={manualEncryptionScreenRoutes.registerLoginRoute}
          component={OnboardingFlow} //{LoginSignUpUser}
        />
        <Stack.Screen name="Auth_Loading" component={AppTestComponent} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};
