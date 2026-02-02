import React from 'react';
import {strings} from '../../../constants/strings/onboarding.strings';
import {Keyboard, TouchableWithoutFeedback, View} from 'react-native';
import {Title1, Title3} from '../../../components/text-titles/title';
import {Input, KeyboardTypes} from '../../../components/input';
import {FormikErrors, FormikTouched} from 'formik';
import {ThemedButton} from '../../../components/themed-button';
import {
  EPopupType,
  ErrorNotificationHandler,
} from '../../../services/error-notification-handler';
import {IOnboardingFormValues} from '../../../app/store/state/onboardingState/onboardingStateTypes';

export const DownloadKey = ({
  keyPassword,
  confirmKeyPassword,
  errors,
  validateForm,
  handleChange,
  handleSubmit,
}: {
  keyPassword: string;
  confirmKeyPassword: string;
  errors: FormikErrors<IOnboardingFormValues>;
  touched: FormikTouched<IOnboardingFormValues>;
  validateForm: (values?: any) => Promise<FormikErrors<IOnboardingFormValues>>;
  handleChange: (field: keyof IOnboardingFormValues) => (value: string) => void;
  handleSubmit: (e?: React.FormEvent<HTMLFormElement> | undefined) => void;
}) => {
  const handleScreenPress = () => {
    Keyboard.dismiss();
  };

  const onSubmit = async () => {
    const errors = await validateForm();
    if (Object.keys(errors).length > 0) {
      ErrorNotificationHandler({
        type: EPopupType.INFO,
        text1: strings.addingPlaceError,
        text2: errors.name,
      });
    }

    handleSubmit();
  };

  return (
    <TouchableWithoutFeedback onPress={handleScreenPress}>
      <View className="flex flex-col items-center flex-1 p-3 w-screen">
        <View className="block flex-1 mt-auto items-center justify-center gap-y-5 overflow-scroll">
          <Title1>{strings.allmostDone}</Title1>
          <Title3>{strings.pleaseSaveYourKey}</Title3>
          <View>
            <Input
              value={keyPassword}
              onChange={handleChange('keyPassword')}
              placeholder={strings.yourKeyPassword}
              keyboardType={KeyboardTypes.default}
              className="w-80"
              isSecure={true}
              isError={!!errors.keyPassword}
            />
            <Input
              value={confirmKeyPassword}
              onChange={handleChange('confirmKeyPassword')}
              placeholder={strings.confirmKeyPassword}
              keyboardType={KeyboardTypes.default}
              className="w-80"
              isSecure={true}
              isError={!!errors.confirmKeyPassword}
            />
          </View>
        </View>
        <ThemedButton
          text={strings.saveYourKey}
          disabled={Object.keys(errors).length > 0}
          theme="filled"
          onPress={onSubmit}
          classCustomBody="w-80"
        />
      </View>
    </TouchableWithoutFeedback>
  );
};
