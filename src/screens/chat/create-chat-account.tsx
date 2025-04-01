import React from 'react';
import {View} from 'react-native';
import {ThemedButton} from '../../components/themed-button';
import {Title1, Title3} from '../../components/title';
import {strings} from './chat.strings';
import {useReduxSelector} from '../../app/store/store';
import {createChatUserApi} from '../../services/api/chat/chat-api';
import {
  EPopupType,
  ErrorNotificationHandler,
} from '../../services/ErrorNotificationHandler';
import {AxiosError} from 'axios';
import {IHttpExceptionResponse} from '../../services/xhr-services/xhr.types';
import {generatePGPKeyPair} from '../../services/pgp-service/generate-keys';
import {useDispatch} from 'react-redux';
import {createUserChatsAccount} from '../../app/store/state/userChats/userChatsAction';
import {
  IChatRoomId,
  IInvitations,
} from '../../app/store/state/userChats/userChatsState.types';

export const CreateChatAccount = () => {
  const {token, id, email, name} = useReduxSelector(
    state => state.anonymousUserReducer.userAccountData,
  );

  const dispatch = useDispatch();

  const onCreateChatAccount = async () => {
    try {
      // TODO: Save here the the user Chat keys to the redux async store
      const userKeys = await generatePGPKeyPair({
        userIds: [{name: name || email, email}],
        numBits: 2048,
      });
      const response = await createChatUserApi(
        {ownerEmail: email, ownerId: id},
        token,
      );

      const storeData = {
        interlocutorId: response.data.interlocutor_id as string,
        accountId: response.data.chat_account_id as string,
        created: response.data.created as Date,
        updated: response.data.updated as Date,
        email: response.data.email as string,
        chatRoomIds: response.data.chat_room_ids as IChatRoomId[],
        invitations: response.data.invitations as IInvitations[],
        publicChatKey: userKeys.publicKey,
        privateChatKey: userKeys.privateKey,
      };

      dispatch(createUserChatsAccount(storeData));
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
