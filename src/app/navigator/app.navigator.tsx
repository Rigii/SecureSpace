import * as React from 'react';
import {
  NavigationContainer,
  NavigationProp,
  useNavigation,
  useNavigationContainerRef,
} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {AppTestComponent} from '../AppTestComponent';
import {PrivateRoute} from './privateRoute';
import {RootStackParamList, manualEncryptionScreenRoutes} from './screens';
import {LoginSignUpUser} from '../../screens/login-signup/login-signup.screen';
import {OnboardingFlow} from '../../screens/onboarding/onboarding';
import TopSidebar from '../../components/screen-wrapper/top-sidebar';
import ChatListScreen from '../../screens/chat/chat-entry/chat-entry-screen';
import {Text} from 'react-native-svg';
import {View} from 'react-native';
import {ThemedButton} from '../../components/themed-button';
import {useState} from 'react';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {CreateChatRoom} from '../../components/create-update-chat/create-update-chat';
import ChatRoomScreen from '../../screens/chat/room-screen/room-screen';

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator();

export const Home = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  return (
    <View>
      <Tab.Screen name="Feed" component={AppTestComponent} />
      <Text>Home</Text>
      <ThemedButton
        text={'Chat List'}
        onPress={() =>
          navigation.navigate(manualEncryptionScreenRoutes.chatList)
        }
        theme={'filled'}
      />
    </View>
  );
};

export const AppNavigationContainer = () => {
  const isAuthenticated = false;
  const navigationRef = useNavigationContainerRef();
  const [currentRoute, setCurrentRoute] = useState<string | null>(null);

  return (
    <SafeAreaProvider>
      <NavigationContainer
        ref={navigationRef}
        onStateChange={() =>
          setCurrentRoute(navigationRef.getCurrentRoute()?.name || null)
        }>
        <TopSidebar currentRoute={currentRoute} />
        <Stack.Navigator screenOptions={{headerShown: false}}>
          <Stack.Screen name={manualEncryptionScreenRoutes.root}>
            {props => (
              <PrivateRoute
                {...props}
                isAuthenticated={isAuthenticated}
                redirectAuthRoute={manualEncryptionScreenRoutes.registerLogin}
                component={Home}
              />
            )}
          </Stack.Screen>
          <Stack.Screen
            name={manualEncryptionScreenRoutes.home}
            component={Home}
          />
          <Stack.Screen
            name={manualEncryptionScreenRoutes.registerLogin}
            component={LoginSignUpUser}
          />
          <Stack.Screen
            name={manualEncryptionScreenRoutes.onboarding}
            component={OnboardingFlow}
          />
          <Stack.Screen
            name={manualEncryptionScreenRoutes.createChatRoom}
            component={CreateChatRoom}
          />
          <Stack.Screen
            name={manualEncryptionScreenRoutes.chatList}
            component={ChatListScreen}
          />
          <Stack.Screen name={manualEncryptionScreenRoutes.chatRoom}>
            {props => <ChatRoomScreen chatId={props.route.params.chatId} />}
          </Stack.Screen>
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
};
