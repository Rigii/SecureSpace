import React from 'react';
import {View, TouchableOpacity, SafeAreaView, Text} from 'react-native';
import {RootStackParamList} from '../../../app/navigator/screens';
import {NavigationProp, useNavigation} from '@react-navigation/native';
import {LogoutSmallIcon} from '../../../assets/icons';
import DropdownButton from '../../modal-side-bar/modal-bar';
import {BackIcon} from '../../../assets/icons/backIcon';
import {ISidebarDropdownDataSet} from '../../modal-side-bar/modal-bar.types';
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

const ComponentsTopBar = ({
  title,
  settingsData,
}: {
  title: string;
  settingsData: ISidebarDropdownDataSet[];
}) => {
  const dispatch = useDispatch();
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  const navigateBack = () => {
    navigation.goBack();
  };

  const onLogOut = async () => {
    dispatch(logOut());

    await dispatch(clearChatRoomData());
    await dispatch(clearChatAccountData());
    await dispatch(clearUser());
    await dispatch(clearRestrictions());
    await dispatch(clearEncryptionData());
    await dispatch(resetForm());

    /* Not EncryptedStorage.clear(); while in IOS simulator it's clear also keychains */
    await EncryptedStorage.removeItem(ESecureStoredKeys.anonymousUser);
    await AsyncStorage.clear();
  };

  return (
    <SafeAreaView className="bg-gray-900 overflow-auto">
      <View className="relative flex-row items-center justify-between px-4 py-3">
        <View className="flex-row">
          <TouchableOpacity onPress={navigateBack}>
            <BackIcon />
          </TouchableOpacity>
          <Text className="text-lg font-medium ml-4 text-[#645050]">
            {title}
          </Text>
        </View>
        <View className="flex-row">
          <View className="mr-3">
            <TouchableOpacity onPress={onLogOut}>
              <LogoutSmallIcon />
            </TouchableOpacity>
          </View>
          <DropdownButton data={settingsData} popupClassName="right-4" />
        </View>
      </View>
    </SafeAreaView>
  );
};

export default ComponentsTopBar;
