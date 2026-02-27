import React from 'react';
import {View, TouchableOpacity, SafeAreaView} from 'react-native';
import {
  RootStackParamList,
  TapplicationScreens,
  applicationRoutes,
} from '../../../app/navigator/screens';
import {NavigationProp, useNavigation} from '@react-navigation/native';
import {ChatIcon, HomeIcon, LogoutSmallIcon} from '../../../assets/icons';
import ModalBar from '../../modal-side-bar/modal-bar';
import {ITopBarMenuActions} from '../../../HOC/combined-bar-component/combined-component';
import {useDispatch} from 'react-redux';
import {
  clearUser,
  logOut,
} from '../../../app/store/state/user-state/user.action';
import {clearChatRoomData} from '../../../app/store/state/chat-rooms-content/chat-room.actions';
import {clearChatAccountData} from '../../../app/store/state/user-chat-account/user-chat-account.actions';
import {clearRestrictions} from '../../../app/store/state/application-restrictions/restrictions.actions';
import {clearEncryptionData} from '../../../app/store/state/manual-encryption/manual-encryption.actions';
import {resetForm} from '../../../app/store/state/onboarding-state/onboarding.slice';
import EncryptedStorage from 'react-native-encrypted-storage';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {ESecureStoredKeys} from '../../../services/async-secure-storage/secure-storage-services';

const TopBar = ({
  currentScreen,
  menuActions,
}: {
  currentScreen: TapplicationScreens;
  menuActions?: ITopBarMenuActions[];
}) => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const dispatch = useDispatch();

  const onLogOut = async () => {
    dispatch(logOut());

    await dispatch(clearChatRoomData());
    await dispatch(clearChatAccountData());
    await dispatch(clearUser());
    await dispatch(clearRestrictions());
    await dispatch(clearEncryptionData());
    await dispatch(resetForm());

    await EncryptedStorage.removeItem(ESecureStoredKeys.anonymousUser); // do not use EncryptedStorage.clear(); while in IOS simulator it's clear also keychains
    await AsyncStorage.clear();
  };

  const toggleRedirectChatHome = () => {
    if (currentScreen === applicationRoutes.chatList) {
      navigation.navigate(applicationRoutes.root);
      return;
    }
    navigation.navigate(applicationRoutes.chatList);
  };

  const rightButtonRedirectionComponent = () => {
    if (currentScreen === applicationRoutes.chatList) {
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
    <SafeAreaView className="bg-gray-900 overflow-auto">
      <View className="relative flex-row items-center justify-between px-4 py-3">
        {menuActions && <ModalBar data={menuActions} />}

        <View className="flex-row gap-4">
          <TouchableOpacity onPress={onLogOut}>
            <LogoutSmallIcon />
          </TouchableOpacity>

          {rightButtonRedirectionComponent()}
        </View>
      </View>
    </SafeAreaView>
  );
};

export default TopBar;
