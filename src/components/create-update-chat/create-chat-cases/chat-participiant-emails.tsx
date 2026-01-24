import React, {useState} from 'react';
import {Keyboard, FlatList, TouchableWithoutFeedback, View} from 'react-native';
import {Title1, Title2} from '../../text-titles/title';
import {Input, KeyboardTypes} from '../../../components/input';
import {ThemedButton} from '../../../components/themed-button';
import {FormikErrors, FormikActions} from 'formik';
import {ICreateRoomFormValues} from '../create-update-chat.types';
import {strings} from '../create-chat-form.strings';

export const ChatParticipiantEmails: React.FC<{
  participiantEmails: string[];
  errors: FormikErrors<ICreateRoomFormValues>;
  setFieldValue: FormikActions<ICreateRoomFormValues>['setFieldValue'];
  onNextPage: () => void;
  validateForm: (values?: any) => Promise<FormikErrors<ICreateRoomFormValues>>;
  handleBlur: {
    (e: React.FocusEvent<any, Element>): void;
    <T = any>(fieldOrEvent: T): T extends string ? (e: any) => void : void;
  };
}> = ({participiantEmails, setFieldValue, onNextPage}) => {
  const [emailArray, updateEmailArray] = useState(['', ...participiantEmails]);

  enum EImergencyEmailPassword {
    password = 'password',
    email = 'email',
  }

  const updateEmailAtIndex = (
    value: string,
    name?: string,
    inputIndex?: number,
  ) => {
    if (inputIndex === undefined || !name) {
      return;
    }
    const lowerCasedValue = value.toLowerCase();
    updateEmailArray(array => {
      const newArray = [...array];
      newArray[inputIndex] = lowerCasedValue;
      if (array.length <= inputIndex + 1 && array.length < 3) {
        return [...newArray, ''];
      }
      return [...newArray];
    });
  };

  const onSaveParticipiantEmails = () => {
    setFieldValue('participiantEmails', emailArray);
    onNextPage();
  };

  const handleScreenPress = () => {
    Keyboard.dismiss();
  };

  const renderEmailInput = ({item, index}: {item: string; index: number}) => (
    <View className="mb-6" key={index}>
      <Input
        isError={item.length > 0 && item.length < 6}
        value={item}
        onChange={updateEmailAtIndex}
        placeholder={strings.participiantEmail}
        keyboardType={KeyboardTypes.default}
        name={EImergencyEmailPassword.email}
        className="w-80"
        inputIndex={index}
      />
    </View>
  );

  return (
    <TouchableWithoutFeedback onPress={handleScreenPress}>
      <View className="flex flex-col items-center flex-1 p-3 w-screen	">
        <View className="block flex-1 m-auto items-center justify-center gap-y-5 overflow-scroll">
          <Title1>{strings.newChatroom}</Title1>
          <Title2 className="break-words">
            {strings.addChatRoomParticipiants}
          </Title2>
          <FlatList<string>
            data={emailArray}
            renderItem={renderEmailInput}
            keyExtractor={(item, index) => index.toString()}
            className="grow-0"
          />
        </View>
        <ThemedButton
          text={strings.next}
          disabled={emailArray.length < 1}
          theme="filled"
          onPress={onSaveParticipiantEmails}
          classCustomBody="w-80"
        />
      </View>
    </TouchableWithoutFeedback>
  );
};
