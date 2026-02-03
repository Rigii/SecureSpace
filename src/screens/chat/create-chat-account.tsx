import React from 'react';
import {View} from 'react-native';
import {ThemedButton} from '../../components/themed-button';
import {Title1, Title3} from '../../components/text-titles/title';
import {strings} from './chat.strings';
import {useReduxSelector} from '../../app/store/store';
import {useDispatch} from 'react-redux';

import {NavigationProp, useNavigation} from '@react-navigation/native';
import {
  applicationRoutes,
  RootStackParamList,
} from '../../app/navigator/screens';
import {createChatAccount} from '../../app/store/saga/chat-account-saga/chat-account.actions';

export const CreateChatAccount = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  const {publicChatKey, privateChatKey, interlocutorId, created} =
    useReduxSelector(state => state.userChatAccountReducer);

  const {token, id, email, name} = useReduxSelector(
    state => state.anonymousUserReducer.userAccountData,
  );

  const dispatch = useDispatch();

  const onCreateChatAccount = async () => {
    dispatch(createChatAccount({email, id, name, token}));
  };

  if (publicChatKey && !privateChatKey) {
    if (!privateChatKey) {
      navigation.navigate(applicationRoutes.uploadKey, {
        publicKey: publicChatKey,
        keyRecordId: interlocutorId,
        keyRecordDate: created.toString(),
        keyType: 'chat',
      });

      return;
    }
  }

  return (
    <View className="flex flex-col items-center flex-1 p-3 w-screen">
      <View className="block flex-1 m-auto items-center justify-center gap-y-5 overflow-scroll">
        <Title1>{strings.joinChat}</Title1>
        <Title3>{strings.toStartMessagingCreateAccount}</Title3>
      </View>
      <ThemedButton
        text={strings.createAccount}
        theme="filled"
        onPress={onCreateChatAccount}
        classCustomBody="w-80"
      />
    </View>
  );
};
