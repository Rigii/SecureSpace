import React from 'react';
import {Title1, Title2} from '../../text-titles/title';
import {ThemedButton} from '../../../components/themed-button';
import {FormikErrors} from 'formik';
import {ICreateRoomFormValues} from '../create-update-chat.types';
import {strings} from '../create-chat-form.strings';
import {FlatList, View} from 'react-native';
import {ISecurePlaceData} from '../../../app/types/encrypt.types';
import {TextNormal} from '../../text-titles/text-styled';

export const ChatCheckData: React.FC<{
  errors: FormikErrors<ICreateRoomFormValues>;
  values: ICreateRoomFormValues;
  onSubmitForm: () => void;
}> = ({errors, values, onSubmitForm}) => {
  const renderedEmail = ({item}: {item: string}) => (
    <TextNormal>{item}</TextNormal>
  );

  const awailabilityAddressRadius =
    values.availabilityAreaData && 'address' in values.availabilityAreaData ? (
      <>
        <View>
          <Title2 className="break-words">{`${strings.awailabilityAddress}: `}</Title2>
          <TextNormal>
            {(values.availabilityAreaData as ISecurePlaceData).address}
          </TextNormal>
        </View>
        <View className="flex-row mt-3">
          <Title2 className="break-words">{`${strings.radius}: `}</Title2>
          <TextNormal>{values.availabilityAreaRadius || '1000'}</TextNormal>
        </View>
      </>
    ) : null;

  return (
    <View className="flex flex-col items-center flex-1 p-3 w-screen	">
      <View className="block flex-1 m-auto items-center justify-center gap-y-3 overflow-scroll">
        <Title1>{strings.checkYourChatData}</Title1>
        <View className="flex-row">
          <Title2>{`${strings.chatName}: `}</Title2>
          <TextNormal>{values.chatName}</TextNormal>
        </View>
        <View className="flex-row">
          <Title2>{`${strings.chatType}: `}</Title2>
          <TextNormal>{values.chatType}</TextNormal>
        </View>
        <View className="flex-col">
          <Title2>{`${strings.participiants}: `}</Title2>
          <FlatList
            data={values.participiantEmails || []}
            keyExtractor={item => item}
            renderItem={renderedEmail}
          />
        </View>
        {awailabilityAddressRadius}
      </View>
      <ThemedButton
        text={strings.next}
        disabled={Object.keys(errors).length > 0}
        theme="filled"
        onPress={onSubmitForm}
        classCustomBody="w-80"
      />
    </View>
  );
};
