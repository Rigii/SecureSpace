import React, {useState} from 'react';
import {strings} from '../../../constants/strings/onboarding.strings';
import {Keyboard, FlatList, TouchableWithoutFeedback, View} from 'react-native';
import {Title1} from '../../../components/text-titles/title';
import {Input, KeyboardTypes} from '../../../components/input';
import {ThemedButton} from '../../../components/themed-button';
import {IUserData} from '../onboarding.types';
import {FormikErrors, FormikActions} from 'formik';
import {IOnboardingFormValues} from '../../../app/store/state/onboardingState/onboardingStateTypes';

export const ImergencyPasswords = ({
  imergencyPasswordsEmails,
  setFieldValue,
  onNextPage,
}: {
  imergencyPasswordsEmails: {email: string; password: string}[];
  errors: FormikErrors<IOnboardingFormValues>;
  setFieldValue: FormikActions<IOnboardingFormValues>['setFieldValue'];
  onNextPage: () => void;
  validateForm: (values?: any) => Promise<FormikErrors<IOnboardingFormValues>>;
  handleBlur: {
    (e: React.FocusEvent<any, Element>): void;
    <T = any>(fieldOrEvent: T): T extends string ? (e: any) => void : void;
  };
}) => {
  const [passwordArray, updatePasswordArray] = useState(
    imergencyPasswordsEmails,
  );

  enum EImergencyEmailPassword {
    password = 'password',
    email = 'email',
  }

  const updatePasswordEmailAtIndex = (
    value: string,
    name?: string,
    inputIndex?: number,
  ) => {
    if (inputIndex === undefined || !name) {
      return;
    }
    updatePasswordArray(array => {
      const newArray = [...array];
      newArray[inputIndex] =
        name === EImergencyEmailPassword.email
          ? {email: value, password: newArray[inputIndex].password}
          : {email: newArray[inputIndex].email, password: value};
      if (array.length <= inputIndex + 1 && array.length < 3) {
        return [...newArray, {email: '', password: ''}];
      }
      return [...newArray];
    });
  };

  const onSavePasswords = () => {
    setFieldValue('imergencyPasswordsEmails', passwordArray);
    onNextPage();
  };

  const handleScreenPress = () => {
    Keyboard.dismiss();
  };

  const renderPasswordInput = ({
    item,
    index,
  }: {
    item: IUserData;
    index: number;
  }) => (
    <View className="mb-6" key={index}>
      <Input
        isError={item.email.length > 0 && item.email.length < 6}
        value={item.email}
        onChange={updatePasswordEmailAtIndex}
        placeholder={strings.imergencyEmailPlaceholder}
        keyboardType={KeyboardTypes.default}
        name={EImergencyEmailPassword.email}
        className="w-80"
        inputIndex={index}
      />
      <Input
        isError={item.password.length > 0 && item.password.length < 6}
        value={item.password}
        onChange={updatePasswordEmailAtIndex}
        name={EImergencyEmailPassword.password}
        placeholder={strings.imergencyPasswordPlaceholder}
        keyboardType={KeyboardTypes.default}
        className="w-80"
        isSecure={true}
        inputIndex={index}
      />
    </View>
  );

  return (
    <TouchableWithoutFeedback onPress={handleScreenPress}>
      <View className="flex flex-col items-center flex-1 p-3 w-screen	">
        <View className="block flex-1 m-auto items-center justify-center gap-y-5 overflow-scroll">
          <Title1>{strings.imergencyPasswords}</Title1>
          <FlatList<IUserData>
            data={passwordArray}
            renderItem={renderPasswordInput}
            keyExtractor={(item, index) => index.toString()}
            className="grow-0"
          />
        </View>
        <ThemedButton
          text={strings.savePasswords}
          disabled={passwordArray[0].password.length < 3}
          theme="filled"
          onPress={onSavePasswords}
          classCustomBody="w-80"
        />
      </View>
    </TouchableWithoutFeedback>
  );
};
