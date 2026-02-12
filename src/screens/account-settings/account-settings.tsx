import React from 'react';
import {SafeAreaView, TouchableOpacity, View} from 'react-native';
import {Title1, Title2} from '../../components/text-titles/title';
import {ThemedButton} from '../../components/themed-button';
import {useReduxSelector} from '../../app/store/store';
import {strings} from './account-settings.strings';
import {BackIcon} from '../../assets/icons/backIcon';
import {NavigationProp, useNavigation} from '@react-navigation/native';
import {RootStackParamList} from '../../app/navigator/screens';
import EncryptedStorage from 'react-native-encrypted-storage';
import {deleteUserAccountApi} from '../../services/api/user/user.api';
import {
  EPopupType,
  ErrorNotificationHandler,
} from '../../components/popup-message/error-notification-handler';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useDispatch} from 'react-redux';
import {clearChatRoomData} from '../../app/store/state/chat-rooms-content/chat-room.actions';
import {clearChatAccountData} from '../../app/store/state/user-chat-account/user-chat-account.actions';
import {clearUser} from '../../app/store/state/user-state/user.action';
import {clearRestrictions} from '../../app/store/state/application-restrictions/restrictions.actions';
import {clearEncryptionData} from '../../app/store/state/manual-encryption/manual-encryption.actions';
import {resetForm} from '../../app/store/state/onboarding-state/onboarding.slice';

export const AccountSetttings = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const {userAccountData} = useReduxSelector(
    state => state.anonymousUserReducer,
  );

  const userChatAccount = useReduxSelector(
    state => state.userChatAccountReducer,
  );

  const navigateBack = () => {
    navigation.goBack();
  };

  const onDeleteAccount = async () => {
    try {
      await deleteUserAccountApi(userAccountData.token, {
        accountId: userAccountData.id,
        interlocutorId: userChatAccount.interlocutorId,
        email: userAccountData.email,
      });

      await dispatch(clearChatRoomData());
      await dispatch(clearChatAccountData());
      await dispatch(clearUser());
      await dispatch(clearRestrictions());
      await dispatch(clearEncryptionData());
      await dispatch(resetForm());

      await EncryptedStorage.clear();
      await AsyncStorage.clear();

      ErrorNotificationHandler({
        type: EPopupType.SUCCESS,
        text1: strings.accountDeleted,
      });
    } catch (error) {
      const currentError = error as Error;

      ErrorNotificationHandler({
        type: EPopupType.ERROR,
        text1: currentError.message,
      });
    }
  };

  return (
    <>
      <SafeAreaView className="absolute z-50">
        <TouchableOpacity onPress={navigateBack} className="top-3 left-3">
          <BackIcon />
        </TouchableOpacity>
      </SafeAreaView>
      <View className="flex flex-col items-center flex-1 p-3 w-screen">
        <View className="block flex-1 m-auto items-center justify-center gap-y-5 overflow-scroll">
          <Title1>{strings.accountSettings}</Title1>
          {userAccountData.name && <Title2>{userAccountData.name}</Title2>}
          <Title2>{userAccountData.email}</Title2>
        </View>
        <ThemedButton
          text={strings.deleteAccount}
          disabled={false}
          theme="filled"
          onPress={onDeleteAccount}
          classCustomBody="w-80"
        />
      </View>
    </>
  );
};
