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
import {Text} from 'react-native-svg';
import {View} from 'react-native';
import {ThemedButton} from '../../components/themed-button';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {CreateChatRoom} from '../../components/create-update-chat/create-update-chat';
import ChatRoomScreen from '../../screens/chat/chat-room-screen/room-screen';
import {CombinedBarHome} from '../../screens/home/home';
import {CombinedChatListScreen} from '../../screens/chat/chat-entry/chat-entry-screen';
import {useReduxSelector} from '../store/store';
import {UploadKey} from '../../screens/upload-keys/upload-keys';

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
  const {token} = useReduxSelector(
    state => state.anonymousUserReducer.userAccountData,
  );
  const {devicePrivateKey} = useReduxSelector(
    state => state.anonymousUserReducer.securityData?.pgpDeviceKeyData,
  );

  const initialComponent = devicePrivateKey ? CombinedBarHome : UploadKey;

  const navigationRef = useNavigationContainerRef();

  return (
    <SafeAreaProvider>
      <NavigationContainer ref={navigationRef}>
        <Stack.Navigator screenOptions={{headerShown: false}}>
          <Stack.Screen name={manualEncryptionScreenRoutes.home}>
            {props => (
              <PrivateRoute
                {...props}
                isAuthenticated={!!token}
                redirectAuthRoute={manualEncryptionScreenRoutes.registerLogin}
                component={initialComponent}
              />
            )}
          </Stack.Screen>
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
            component={CombinedChatListScreen}
          />
          <Stack.Screen name={manualEncryptionScreenRoutes.chatRoom}>
            {props => <ChatRoomScreen chatId={props.route.params.chatId} />}
          </Stack.Screen>
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
};
