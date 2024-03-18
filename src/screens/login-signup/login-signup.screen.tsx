import React from 'react';
import {useLoginSignUpUserState} from './login-signup.state';
import {strings} from '../../constants/strings/login-signup.strings';
import {Input, KeyboardTypes} from '../../components/input';
import {ThemedButton} from '../../components/themed-button';
// import {GoogleIcon, OutlookIcon} from '../../assets/icons';
import {View} from 'react-native';
import {Title1, Title2} from '../../components/title';
import {TextButton} from '../../components/text-styled';
import {Formik} from 'formik';
import {ILoginFormValues} from './login-sign-up.types';
import * as Yup from 'yup';

const SignupSchema = Yup.object().shape({
  password: Yup.string()
    .min(2, 'Too Short!')
    .max(50, 'Too Long!')
    .required('Required'),
  email: Yup.string().email('Invalid email').required('Required'),
});

export const LoginSignUpUser: React.FC = () => {
  const {onMicrosoftSignUp, onGoogleSignUp, loginSignUp, onForgotPassword} =
    useLoginSignUpUserState();

  return (
    <View className="flex flex-col content-center items-center justify-center flex-1 w-full gap-y-5">
      <Title1>{strings.secureSpace}</Title1>
      <Title2 className="text-opacity-gray">{strings.enterAccount}</Title2>
      <Formik<ILoginFormValues>
        validationSchema={SignupSchema}
        initialValues={{email: '', password: ''}}
        onSubmit={values =>
          loginSignUp({email: values.email, password: values.password})
        }>
        {({handleChange, handleSubmit, values, errors}) => (
          <View className="flex flex-col justify-center items-center gap-y-5 w-full relative">
            <View className="flex flex-col justify-center items-center gap-y-2 w-full">
              <Input
                isError={!!errors.email}
                value={values.email}
                onChange={handleChange('email')}
                placeholder={strings.emailHolder}
                keyboardType={KeyboardTypes.emailAddress}
                className="w-80"
              />
              <Input
                isError={!!errors.password}
                value={values.password}
                onChange={handleChange('password')}
                placeholder={strings.passwordHolder}
                keyboardType={KeyboardTypes.emailAddress}
                className="w-80"
              />
            </View>
            <ThemedButton
              text={strings.login}
              disabled={!!errors.email || !!errors.password}
              theme="filled"
              onPress={handleSubmit}
              classCustomBody="w-80"
            />
          </View>
        )}
      </Formik>

      <TextButton onPress={onForgotPassword}>
        {strings.forgotYourPassword}
      </TextButton>
      <View className="gap-1">
        <ThemedButton
          text={strings.enterWithGoogle}
          theme="lightBordered"
          // rightContent={<GoogleIcon />}
          onPress={onGoogleSignUp}
        />
        <ThemedButton
          text={strings.enterWithOutlook}
          theme="lightBordered"
          // rightContent={<OutlookIcon />}
          onPress={onMicrosoftSignUp}
        />
      </View>
    </View>
  );
};
