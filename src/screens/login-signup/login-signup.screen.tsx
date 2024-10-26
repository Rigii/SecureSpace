import React from 'react';
import {useLoginSignUpUserState} from './login-signup.state';
import {strings} from '../../constants/strings/login-signup.strings';
import {ThemedButton} from '../../components/themed-button';
// import {GoogleIcon, OutlookIcon} from '../../assets/icons';
import {View} from 'react-native';
import {Title1, Title2} from '../../components/title';
import {TextButton} from '../../components/text-styled';
import {EmailPasswordForm} from './email-password-form';
import {EAuthMode} from './login-sign-up.types';

export const LoginSignUpUser: React.FC = () => {
  const {
    onMicrosoftSignUp,
    onGoogleSignUp,
    loginSignUp,
    onForgotPassword,
    onChangeMode,
    mode,
  } = useLoginSignUpUserState();

  return (
    <View className="flex flex-col content-center items-center justify-center flex-1 w-full gap-y-5">
      <Title1>{strings.secureSpace}</Title1>
      <Title2 className="text-opacity-gray">{strings.enterAccount}</Title2>
      <EmailPasswordForm loginSignUp={loginSignUp} mode={mode} />
      <TextButton onPress={onForgotPassword}>
        {strings.forgotYourPassword}
      </TextButton>
      <TextButton onPress={onChangeMode}>
        {mode === EAuthMode.logIn ? strings.signUp : strings.logIn}
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
