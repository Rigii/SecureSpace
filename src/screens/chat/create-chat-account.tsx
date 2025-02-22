import React from 'react';
import {View} from 'react-native';
import {ThemedButton} from '../../components/themed-button';
import {Title1, Title3} from '../../components/title';
import {strings} from './chat.strings';
import {useReduxSelector} from '../../app/store/store';
import {createChatUserApi} from '../../services/api/chat/chat.api';
import {
  EPopupType,
  ErrorNotificationHandler,
} from '../../services/ErrorNotificationHandler';
import {AxiosError} from 'axios';
import {IHttpExceptionResponse} from '../../services/xhr-services/xhr.types';

export const CreateChatAccount = () => {
  const {token, id, email} = useReduxSelector(
    state => state.anonymousUserReducer.userAccountData,
  );

  const onCreateChatAccount = async () => {
    try {
      await createChatUserApi({ownerEmail: email, ownerId: id}, token);
    } catch (error) {
      const typedError = error as AxiosError<IHttpExceptionResponse>;
      ErrorNotificationHandler({
        type: EPopupType.ERROR,
        text1: strings.creatingChatAccountError,
        text2: typedError.message,
      });
    }
  };

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
