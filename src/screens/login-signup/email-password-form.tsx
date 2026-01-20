import React from 'react';
import {Input, KeyboardTypes} from '../../components/input';
import {ThemedButton} from '../../components/themed-button';
import {View} from 'react-native';
import {Formik} from 'formik';
import {EAuthMode, ILoginFormValues} from './login-sign-up.types';
import * as Yup from 'yup';
import {strings} from './login-signup.strings';

export const EmailPasswordForm: React.FC<{
  loginSignUp: ({
    email,
    password,
  }: {
    email: string;
    password: string;
  }) => Promise<void>;
  mode: EAuthMode;
}> = ({loginSignUp, mode}) => {
  const SignUpSchema = Yup.object().shape({
    password: Yup.string()
      .min(2, strings.tooShort)
      .max(50, strings.tooLong)
      .required(strings.required),
    email: Yup.string().email(strings.invalidEmail).required(strings.required),
  });

  const createEmailChangeHandler = (handleChange: any) => {
    return (text: string) => {
      const lowerCaseText = text.toLowerCase();
      handleChange('email')(lowerCaseText);
    };
  };

  return (
    <Formik<ILoginFormValues>
      validateOnChange={true}
      validateOnBlur={true}
      enableReinitialize={true}
      isInitialValid={false}
      validationSchema={SignUpSchema}
      initialValues={{email: '', password: ''}}
      onSubmit={values => {
        loginSignUp({email: values.email, password: values.password});
      }}>
      {({handleChange, handleSubmit, values, errors, touched}) => (
        <View className="flex flex-col justify-center items-center gap-y-5 w-full relative">
          <View className="flex flex-col justify-center items-center gap-y-2 w-full">
            <Input
              isError={!!errors.email && touched.email}
              value={values.email}
              onChange={createEmailChangeHandler(handleChange)}
              name="email"
              placeholder={strings.emailHolder}
              keyboardType={KeyboardTypes.emailAddress}
              className="w-80"
            />
            <Input
              name="password"
              isError={!!errors.password && touched.password}
              value={values.password}
              onChange={handleChange('password')}
              placeholder={strings.passwordHolder}
              keyboardType={KeyboardTypes.emailAddress}
              className="w-80"
              isSecure={true}
            />
          </View>
          <ThemedButton
            text={mode === EAuthMode.logIn ? strings.logIn : strings.signUp}
            disabled={
              (!!errors.email && touched.email) ||
              (!!errors.password && touched.password)
            }
            theme="filled"
            onPress={handleSubmit}
            classCustomBody="w-80"
          />
        </View>
      )}
    </Formik>
  );
};
