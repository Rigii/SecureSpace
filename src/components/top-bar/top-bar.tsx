import React from 'react';
import {View, TouchableOpacity} from 'react-native';
import {
  RootStackParamList,
  TManualEncryptionScreens,
  manualEncryptionScreenRoutes,
} from '../../app/navigator/screens';
import {NavigationProp, useNavigation} from '@react-navigation/native';
import {ChatIcon, HomeIcon, LogoutSmallIcon} from '../../assets/icons';
import DropdownButton from '../modal-side-bar/modal-bar';

const TopBar = ({currentScreen}: {currentScreen: TManualEncryptionScreens}) => {
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
    <View className="relative flex-row items-center justify-between px-4 py-3">
      <DropdownButton currentScreen={currentScreen} />

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
