import React from 'react';
import {View, TouchableOpacity} from 'react-native';
import {
  RootStackParamList,
  manualEncryptionScreenRoutes,
} from '../../app/navigator/screens';
import {SidebarIcon} from '../../assets/icons/sidebarIcon';
import {LogoutSmallIcon} from '../../assets/icons/logoutSmallIcon';
import {HomeIcon} from '../../assets/icons/homeIcon';
import {ChatIcon} from '../../assets/icons/chatIcon';
import {NavigationProp, useNavigation} from '@react-navigation/native';

const TopBar = ({currentScreen}: {currentScreen: string}) => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  const toggleRedirectChatHome = () => {
    if (currentScreen === manualEncryptionScreenRoutes.chatList) {
      navigation.navigate(manualEncryptionScreenRoutes.home);
      return;
    }
    navigation.navigate(manualEncryptionScreenRoutes.chatList);
  };

  const rightButtonRedirectionComponent = () => {
    if (currentScreen === manualEncryptionScreenRoutes.chatList) {
      return (
        <TouchableOpacity onPress={toggleRedirectChatHome}>
          <HomeIcon />
        </TouchableOpacity>
      );
    }
    return (
      <TouchableOpacity onPress={toggleRedirectChatHome}>
        <ChatIcon />
      </TouchableOpacity>
    );
  };

  return (
    <View className="flex-row items-center justify-between px-4 py-3">
      <TouchableOpacity>
        <SidebarIcon />
      </TouchableOpacity>

      <View className="flex-row gap-4">
        <TouchableOpacity>
          <LogoutSmallIcon />
        </TouchableOpacity>

        {rightButtonRedirectionComponent()}
      </View>
    </View>
  );
};

export default TopBar;
