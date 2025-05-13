import React from 'react';
import {SafeAreaView, TouchableOpacity, View} from 'react-native';
import {Title1, Title2} from '../../components/text-titles/title';
import {ThemedButton} from '../../components/themed-button';
import {useReduxSelector} from '../../app/store/store';
import {strings} from './account-settings.strings';
import {BackIcon} from '../../assets/icons/backIcon';
import {NavigationProp, useNavigation} from '@react-navigation/native';
import {RootStackParamList} from '../../app/navigator/screens';

export const AccountSetttings = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const {userAccountData} = useReduxSelector(
    state => state.anonymousUserReducer,
  );

  const navigateBack = () => {
    navigation.goBack();
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
          onPress={navigateBack}
          classCustomBody="w-80"
        />
      </View>
    </>
  );
};
