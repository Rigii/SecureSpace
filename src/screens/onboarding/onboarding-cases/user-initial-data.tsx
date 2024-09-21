import React from 'react';
import {strings} from '../../../constants/strings/onboarding.strings';
import {View} from 'react-native';
import {Title1} from '../../../components/title';
import {Input, KeyboardTypes} from '../../../components/input';
import RadioGroup from 'react-native-radio-buttons-group';
import {FormikHandlers, FormikActions} from 'formik';
import {IOnboardingFormValues} from '../onboarding-flow';

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
      rb => rb.id === selectedId,
    );
    if (selectedRadioButton) {
      setFieldValue('sex', selectedRadioButton.value);
    }
  };

  return (
    <View className="flex flex-col content-center items-center justify-center flex-1 w-full gap-y-5">
      <Title1>{strings.accountData}</Title1>
      <Input
        // isError={!!errors.email && touched.email}
        value={nikValue}
        onChange={handleChange('nik')}
        name="nik"
        placeholder={strings.nikPlaceholder}
        keyboardType={KeyboardTypes.default}
        className="w-80"
      />

      <RadioGroup
        radioButtons={radioButtonsData.map(rb => ({
          ...rb,
          selected: rb.value === sexValue,
        }))}
        onPress={onRadioButtonPress}
      />
    </View>
  );
};
