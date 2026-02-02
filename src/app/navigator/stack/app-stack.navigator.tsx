import * as React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {RootStackParamList, applicationRoutes} from '../screens';
import {CreateChatRoom} from '../../../components/create-update-chat/create-update-chat';
import ChatRoomScreen from '../../../screens/chat/chat-room-screen/room-screen';
import {CombinedBarHome} from '../../../screens/home/home';
import {CombinedChatListScreen} from '../../../screens/chat/chat-entry/chat-entry-screen';
import {AccountSetttings} from '../../../screens/account-settings/account-settings';
import {UploadKey} from '../../../screens/upload-keys/upload-keys';

const Stack = createNativeStackNavigator<RootStackParamList>();

export const AppStack = () => {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name={applicationRoutes.root} component={CombinedBarHome} />
      <Stack.Screen
        name={applicationRoutes.createChatRoom}
        component={CreateChatRoom}
      />
      <Stack.Screen
        name={applicationRoutes.chatList}
        component={CombinedChatListScreen}
      />
      <Stack.Screen
        name={applicationRoutes.accountSettings}
        component={AccountSetttings}
      />
      <Stack.Screen name={applicationRoutes.uploadKey} component={UploadKey} />
      <Stack.Screen name={applicationRoutes.chatRoom}>
        {props => <ChatRoomScreen chatId={props.route.params.chatId} />}
      </Stack.Screen>
    </Stack.Navigator>
  );
};
