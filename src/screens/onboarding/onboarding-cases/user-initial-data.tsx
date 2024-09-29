import React from 'react';
import {strings} from '../../../constants/strings/onboarding.strings';
import {View} from 'react-native';
import {Title1} from '../../../components/title';
import {Input, KeyboardTypes} from '../../../components/input';
import RadioGroup from 'react-native-radio-buttons-group';
import {FormikHandlers, FormikActions} from 'formik';
import {IOnboardingFormValues} from '../onboarding-flow';
import {ThemedButton} from '../../../components/themed-button';

const radioButtonsData = [
  {id: '1', label: 'Male', value: 'male'},
  {id: '2', label: 'Female', value: 'female'},
  {id: '3', label: 'Other', value: 'other'},
];

export const UserInitialData = ({
  nikValue,
  sexValue,
  handleChange,
  setFieldValue,
}: {
  nikValue: string;
  sexValue: string;
  handleChange: FormikHandlers['handleChange'];
  setFieldValue: FormikActions<IOnboardingFormValues>['setFieldValue'];
}) => {
  const onRadioButtonPress = (selectedId: string) => {
    const selectedRadioButton = radioButtonsData.find(
      rb => rb.id === `${selectedId}`,
    );
    if (!selectedRadioButton) {
      return;
    }

    console.log(222, selectedRadioButton.value);
    setFieldValue('sex', selectedRadioButton.id);
  };

  return (
    <View className="flex flex-col items-center flex-1 p-3 w-screen	relative">
      <Title1 className="break-words">{strings.accountData}</Title1>
      <View className="block flex-1 m-auto items-center justify-center gap-y-5">
        <Title1 className="break-words">{strings.nikSex}</Title1>
        <Input
          // isError={!!errors.email && touched.email}
          value={nikValue}
          onChange={handleChange('nik')}
          name="nik"
          placeholder={strings.nikPlaceholder}
          keyboardType={KeyboardTypes.default}
          className="w-80"
        />
        <View className="flex flex-row">
          <RadioGroup
            layout="row"
            radioButtons={radioButtonsData.map(rb => ({
              ...rb,
              selected: rb.value === sexValue,
            }))}
            selectedId={sexValue}
            onPress={onRadioButtonPress}
          />
        </View>
      </View>
      <ThemedButton
        text={strings.savePasswords}
        // disabled={passwordArray[0].length > 3}
        theme="filled"
        onPress={() => null}
        classCustomBody="w-80"
      />
    </View>
  );
};
