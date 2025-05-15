import React from 'react';
import {View, TouchableOpacity, SafeAreaView} from 'react-native';
import {
  RootStackParamList,
  TManualEncryptionScreens,
  manualEncryptionScreenRoutes,
} from '../../../app/navigator/screens';
import {NavigationProp, useNavigation} from '@react-navigation/native';
import {ChatIcon, HomeIcon, LogoutSmallIcon} from '../../../assets/icons';
import DropdownButton from '../../modal-side-bar/modal-bar';
import {ITopBarMenuActions} from '../../../HOC/combined-bar-component/combined-component';
import {useDispatch} from 'react-redux';
import {clearUser, logOut} from '../../../app/store/state/userState/userAction';
import {clearChatRoomData} from '../../../app/store/state/chatRoomsContent/chatRoomsAction';
import {clearChatAccountData} from '../../../app/store/state/userChatAccount/userChatAccountAction';
import {clearRestrictions} from '../../../app/store/state/applicationRestrictions/restrictionAction';
import {clearEncryptionData} from '../../../app/store/state/manualEncryption/updateManualEncryptionAction';
import {resetForm} from '../../../app/store/state/onboardingState/onboardingSlice';
import EncryptedStorage from 'react-native-encrypted-storage';
import AsyncStorage from '@react-native-async-storage/async-storage';

const TopBar = ({
  currentScreen,
  menuActions,
}: {
  currentScreen: TManualEncryptionScreens;
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

    await EncryptedStorage.clear();
    await AsyncStorage.clear();
  };

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
    <SafeAreaView className="bg-gray-900 overflow-auto">
      <View className="relative flex-row items-center justify-between px-4 py-3">
        {menuActions && <DropdownButton data={menuActions} />}

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
