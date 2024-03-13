import * as React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {AppTestComponent} from './AppTestComponent';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

export const Home = () => (
  <Tab.Navigator>
    <Tab.Screen name="Feed" component={AppTestComponent} />
  </Tab.Navigator>
);

export const AppNavigationContainer = () => (
  <NavigationContainer>
    <Stack.Navigator>
      <Stack.Screen
        name="Home"
        component={Home}
        options={{headerShown: false}}
      />
      <Stack.Screen name="Login" component={AppTestComponent} />
      <Stack.Screen name="Auth_Loading" component={AppTestComponent} />
    </Stack.Navigator>
  </NavigationContainer>
);
