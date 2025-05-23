import React, {useEffect} from 'react';
import {strings} from '../../../constants/strings/onboarding.strings';
import {Keyboard, TouchableWithoutFeedback, View} from 'react-native';
import {Title1} from '../../../components/text-titles/title';
import {Input, KeyboardTypes} from '../../../components/input';
import RadioGroup from 'react-native-radio-buttons-group';
import {FormikActions} from 'formik';
import {ThemedButton} from '../../../components/themed-button';
import {FormikErrors, FormikTouched} from 'formik';
import {radioButtonsData} from '../onboarding.mocked';
import {IOnboardingFormValues} from '../../../app/store/state/onboardingState/onboardingStateTypes';

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
  errors: FormikErrors<IOnboardingFormValues>;
  touched: FormikTouched<IOnboardingFormValues>;
  nikValue: string;
  sexValue: string;

  handleBlur: {
    (e: React.FocusEvent<any, Element>): void;
    <T = any>(fieldOrEvent: T): T extends string ? (e: any) => void : void;
  };
  handleChange: (field: keyof IOnboardingFormValues) => (value: string) => void;
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

    setFieldValue('titleForm', selectedRadioButton.id);
  };

  const onHandleBlur = () => {
    handleBlur('name');
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
          <Title1 className="break-words">{strings.nik}</Title1>
          <Input
            isError={touched.name && !!errors.name}
            value={nikValue}
            onBlur={onHandleBlur}
            onChange={handleChange('name')}
            name="name"
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
                key: rb.value,
              }))}
              selectedId={sexValue}
              onPress={onRadioButtonPress}
            />
          </View>
        </View>
        <ThemedButton
          text={strings.saveNikname}
          disabled={!!errors.name || !!errors.titleForm}
          theme="filled"
          onPress={onNextPage}
          classCustomBody="w-80"
        />
      </View>
    </TouchableWithoutFeedback>
  );
};
