import React from 'react';
import {Title1, Title2} from '../../title';
import {View} from 'react-native';
import {Input, KeyboardTypes} from '../../input';
import {ThemedButton} from '../../themed-button';
import {FormikErrors, FormikTouched, FormikActions} from 'formik';
import {strings} from '../create-chat-form.strings';
import {EChatVariants} from '../../../app/store/state/chatRoomsContent/chatRoomsState.types';
import {RadioGroup} from 'react-native-radio-buttons-group';
import {radioButtonsData} from '../create-chat-mocked';
import {ICreateRoomFormValues} from '../create-update-chat.types';

export const ChatNameType: React.FC<{
  chatName: string;
  chatType: EChatVariants;
  touched: FormikTouched<ICreateRoomFormValues>;
  errors: FormikErrors<ICreateRoomFormValues>;
  onNextPage: () => void;
  setFieldValue: FormikActions<ICreateRoomFormValues>['setFieldValue'];
  handleBlur: {
    (e: React.FocusEvent<any, Element>): void;
    <T = any>(fieldOrEvent: T): T extends string ? (e: any) => void : void;
  };
  handleChange: (field: keyof ICreateRoomFormValues) => (value: string) => void;
}> = ({
  chatName,
  chatType,
  touched,
  errors,
  onNextPage,
  handleBlur,
  handleChange,
  setFieldValue,
}) => {
  const onRadioButtonPress = (selectedId: string) => {
    const selectedRadioButton = radioButtonsData.find(
      rb => rb.id === `${selectedId}`,
    );

    if (!selectedRadioButton) {
      return;
    }

    setFieldValue('chatType', selectedRadioButton.id);
  };
  const onHandleBlur = () => handleBlur('chatName');

  return (
    <View className="flex flex-col items-center flex-1 p-3 w-screen	relative">
      <View className="block flex-1 m-auto items-center justify-center gap-y-5">
        <Title1 className="break-words">{strings.newChatroom}</Title1>
        <Title2 className="break-words">{strings.nameAndType}</Title2>
        <Input
          isError={touched.chatName && !!errors.chatName}
          value={chatName}
          onBlur={onHandleBlur}
          onChange={handleChange('chatName')}
          name="chatName"
          placeholder={strings.roomName}
          keyboardType={KeyboardTypes.default}
          className="w-80"
        />
        <View className="flex flex-row">
          <RadioGroup
            layout="row"
            radioButtons={radioButtonsData.map(rb => ({
              ...rb,
              selected: rb.value === chatType,
              key: rb.value,
            }))}
            selectedId={chatType}
            onPress={onRadioButtonPress}
          />
        </View>
      </View>
      <ThemedButton
        text={strings.next}
        disabled={!!errors.chatName || !!errors.chatType}
        theme="filled"
        onPress={onNextPage}
        classCustomBody="w-80"
      />
    </View>
  );
};
