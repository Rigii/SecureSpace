import React, {useState} from 'react';
import {strings} from '../../../constants/strings/onboarding.strings';
import {Keyboard, FlatList, TouchableWithoutFeedback, View} from 'react-native';
import {Title1} from '../../../components/title';
import {Input, KeyboardTypes} from '../../../components/input';
import {ThemedButton} from '../../../components/themed-button';
import {IOnboardingFormValues} from '../onboarding.types';
import {FormikErrors, FormikHandlers, FormikActions} from 'formik';

export const ImergencyPasswords = ({
  imergencyPasswords,
  setFieldValue,
  onNextPage,
}: {
  imergencyPasswords: string[];
  errors: FormikErrors<IOnboardingFormValues>;
  handleChange: FormikHandlers['handleChange'];
  setFieldValue: FormikActions<IOnboardingFormValues>['setFieldValue'];
  onNextPage: () => void;
  validateForm: (values?: any) => Promise<FormikErrors<IOnboardingFormValues>>;
  handleBlur: {
    (e: React.FocusEvent<any, Element>): void;
    <T = any>(fieldOrEvent: T): T extends string ? (e: any) => void : void;
  };
}) => {
  const [passwordArray, updatePasswordArray] = useState(imergencyPasswords);

  const updatePasswordAtIndex = (index: number, newValue: string) => {
    updatePasswordArray(array => {
      const newArray = [...array];
      newArray[index] = newValue;
      if (array.length <= index + 1 && array.length < 3) {
        return [...newArray, ''];
      }
      return [...newArray];
    });
  };

  const onSavePasswords = () => {
    setFieldValue('imergencyPasswords', passwordArray);
    onNextPage();
  };

  const handleScreenPress = () => {
    Keyboard.dismiss();
  };

  const renderPasswordInput = ({
    item,
    index,
  }: {
    item: string;
    index: number;
  }) => (
    <Input
      isError={item.length > 0 && item.length < 6}
      value={item}
      onChange={(value: string) => updatePasswordAtIndex(index, value)}
      name="password"
      placeholder={strings.passwordPlaceholder}
      keyboardType={KeyboardTypes.default}
      className="w-80"
      key={index}
      isSecure={true}
    />
  );

  return (
    <TouchableWithoutFeedback onPress={handleScreenPress}>
      <View className="flex flex-col items-center flex-1 p-3 w-screen	">
        <View className="block flex-1 m-auto items-center justify-center gap-y-5 overflow-scroll">
          <Title1>{strings.imergencyPasswords}</Title1>
          <FlatList
            data={passwordArray}
            renderItem={renderPasswordInput}
            keyExtractor={(item, index) => index.toString()}
            className="grow-0"
          />
        </View>
        <ThemedButton
          text={strings.savePasswords}
          disabled={passwordArray[0].length < 3}
          theme="filled"
          onPress={onSavePasswords}
          classCustomBody="w-80"
        />
      </View>
    </TouchableWithoutFeedback>
  );
};
