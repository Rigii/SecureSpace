import React from 'react';
import {Title1, Title2} from '../../title';
import {View} from 'react-native';
import {Input, KeyboardTypes} from '../../input';
import {ThemedButton} from '../../themed-button';
import {FormikErrors, FormikTouched} from 'formik';
import {strings} from '../create-chat-form.strings';
import {ICreateRoomFormValues} from '../create-update-chat.types';

export const ChatPassword: React.FC<{
  password: string;
  touched: FormikTouched<ICreateRoomFormValues>;
  errors: FormikErrors<ICreateRoomFormValues>;
  onNextPage: () => void;
  handleBlur: {
    (e: React.FocusEvent<any, Element>): void;
    <T = any>(fieldOrEvent: T): T extends string ? (e: any) => void : void;
  };
  handleChange: (field: keyof ICreateRoomFormValues) => (value: string) => void;
}> = ({password, touched, errors, handleBlur, handleChange, onNextPage}) => {
  return (
    <View className="flex flex-col items-center flex-1 p-3 w-screen	relative">
      <View className="block flex-1 m-auto items-center justify-center gap-y-5">
        <Title1 className="break-words">{strings.newChatroom}</Title1>
        <Title2 className="break-words">{`${strings.chatPassword} (${strings.optional})`}</Title2>
        <Input
          isError={touched.password && !!errors.password}
          value={password}
          onBlur={() => handleBlur('password')}
          onChange={handleChange('password')}
          name="password"
          placeholder={strings.password}
          keyboardType={KeyboardTypes.default}
          className="w-80"
        />
      </View>
      <ThemedButton
        text={strings.next}
        theme="filled"
        onPress={onNextPage}
        classCustomBody="w-80"
      />
    </View>
  );
};
