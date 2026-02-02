import * as React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {RootStackParamList, applicationRoutes} from '../screens';
import {LoginSignUpUser} from '../../../screens/login-signup/login-signup.screen';
import {OnboardingFlow} from '../../../screens/onboarding/onboarding';

const AuthStackNav = createNativeStackNavigator<RootStackParamList>();

export const AuthStack = () => {
  return (
    <AuthStackNav.Navigator screenOptions={{headerShown: false}}>
      <AuthStackNav.Screen
        name={applicationRoutes.registerLogin}
        component={LoginSignUpUser}
      />
      <AuthStackNav.Screen
        name={applicationRoutes.onboarding}
        component={OnboardingFlow}
      />
    </AuthStackNav.Navigator>
  );
};
