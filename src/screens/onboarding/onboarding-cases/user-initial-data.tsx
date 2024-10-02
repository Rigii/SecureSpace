import React, {useEffect} from 'react';
import {strings} from '../../../constants/strings/onboarding.strings';
import {Keyboard, TouchableWithoutFeedback, View} from 'react-native';
import {Title1} from '../../../components/title';
import {Input, KeyboardTypes} from '../../../components/input';
import RadioGroup from 'react-native-radio-buttons-group';
import {FormikHandlers, FormikActions} from 'formik';
import {ThemedButton} from '../../../components/themed-button';
import {FormikErrors, FormikTouched} from 'formik';
import {IOnboardingFormValues} from '../onboarding.types';
import {radioButtonsData} from '../onboarding.mocked';

export const UserInitialData = ({
  nikValue,
  sexValue,
  errors,
  touched,
  handleChange,
  setFieldValue,
  handleBlur,
  onNextPage,
  validateForm,
}: {
  nikValue: string;
  sexValue: string;
  errors: FormikErrors<IOnboardingFormValues>;
  touched: FormikTouched<IOnboardingFormValues>;
  handleBlur: {
    (e: React.FocusEvent<any, Element>): void;
    <T = any>(fieldOrEvent: T): T extends string ? (e: any) => void : void;
  };
  handleChange: FormikHandlers['handleChange'];
  setFieldValue: FormikActions<IOnboardingFormValues>['setFieldValue'];
  onNextPage: () => void;
  validateForm: (values?: any) => Promise<FormikErrors<IOnboardingFormValues>>;
}) => {
  const onRadioButtonPress = (selectedId: string) => {
    const selectedRadioButton = radioButtonsData.find(
      rb => rb.id === `${selectedId}`,
    );
    if (!selectedRadioButton) {
      return;
    }

    setFieldValue('sex', selectedRadioButton.id);
  };

  const onHandleBlur = () => {
    handleBlur('nik');
  };

  const handleScreenPress = () => {
    Keyboard.dismiss();
  };

  useEffect(() => {
    validateForm();
  }, [validateForm]);

  return (
    <TouchableWithoutFeedback onPress={handleScreenPress}>
      <View className="flex flex-col items-center flex-1 p-3 w-screen	relative">
        <View className="block flex-1 m-auto items-center justify-center gap-y-5">
          <Title1 className="break-words">{strings.nikSex}</Title1>
          <Input
            isError={touched.nik && !!errors.nik}
            value={nikValue}
            onBlur={onHandleBlur}
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
          text={strings.saveNikname}
          disabled={!!errors.nik || !!errors.sex}
          theme="filled"
          onPress={onNextPage}
          classCustomBody="w-80"
        />
      </View>
    </TouchableWithoutFeedback>
  );
};
