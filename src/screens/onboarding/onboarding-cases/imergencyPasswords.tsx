import React, {useState} from 'react';
import {strings} from '../../../constants/strings/onboarding.strings';
import {FlatList, View} from 'react-native';
import {Title1} from '../../../components/title';
import {Input, KeyboardTypes} from '../../../components/input';
import {FormikActions} from 'formik';
import {IOnboardingFormValues} from '../onboarding-flow';
import {ThemedButton} from '../../../components/themed-button';

export const ImergencyPasswords = ({
  imergencyPasswords,
  setFieldValue,
}: {
  imergencyPasswords: string[];
  setFieldValue: FormikActions<IOnboardingFormValues>['setFieldValue'];
}) => {
  const [passwordArray, updatePasswordArray] = useState(imergencyPasswords);

  const updatePasswordAtIndex = (index: number, newValue: string) => {
    if (!passwordArray[index + 1]) {
      updatePasswordArray(array => [...array, '']);
    }
    const newArray = [...passwordArray];
    newArray[index] = newValue;

    updatePasswordArray(newArray);
  };

  //   const passwordInputComponent = ({
  //     value,
  //     key,
  //     onPasswordChange,
  //   }: {
  //     value: string;
  //     key: number;
  //     onPasswordChange: (value: string) => void;
  //   }) => (
  //     <Input
  //       // isError={!!errors.email && touched.email}
  //       value={value}
  //       onChange={onPasswordChange}
  //       name="password"
  //       placeholder={strings.passwordPlaceholder}
  //       keyboardType={KeyboardTypes.default}
  //       className="w-80"
  //       key={key}
  //     />
  //   );

  const onSavePasswords = () => {
    setFieldValue('imergencyPasswords', passwordArray);
  };

  const renderPasswordInput = ({
    item,
    index,
  }: {
    item: string;
    index: number;
  }) => (
    <Input
      // isError={!!errors.email && touched.email}
      value={item}
      onChange={(value: string) => updatePasswordAtIndex(index, value)}
      name="password"
      placeholder={strings.passwordPlaceholder}
      keyboardType={KeyboardTypes.default}
      className="w-80"
      key={index}
    />
  );

  return (
    <View>
      <Title1>{strings.accountData}</Title1>
      <FlatList
        data={passwordArray} // Provide the password array as the data source
        renderItem={renderPasswordInput} // The render function
        keyExtractor={(item, index) => index.toString()}
      />
      <ThemedButton
        text={strings.savePasswords}
        disabled={passwordArray[0].length > 3}
        theme="filled"
        onPress={onSavePasswords}
        classCustomBody="w-80"
      />
    </View>
  );
};
