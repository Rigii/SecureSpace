import React from 'react';
// import {ISetAccountDetails} from 'components/OnBoarding/CreateAccount/CreateAccount.types';
// import {EAuthMode} from '../encryptionAuth.types';
import {useLoginSignUpUserState} from './login-signup.state';
// import SetEmailPassword from './SetEmailPassword';
import {strings} from '../../constants/strings/login-signup.strings';
import {Input, KeyboardTypes} from '../../components/input';
import {ThemedButton} from '../../components/themed-button';
// import {GoogleIcon, OutlookIcon} from '../../assets/icons';
import {View} from 'react-native';
import SetEmailPassword from './set-email-password';
import {Title1, Title2} from '../../components/title';
import {TextBold, TextButton} from '../../components/text-styled';

export const LoginSignUpUser: React.FC = () => {
  const {
    currentStrings,
    isEmailValid,
    email,
    password,
    emailPasswordStep,
    mode,
    onMicrosoftSignUp,
    onGoogleSignUp,
    setStep,
    setPassword,
    emailSignUp,
    onChangeMode,
    onForgotPassword,
    setEmail,
  } = useLoginSignUpUserState();

  if (emailPasswordStep) {
    return (
      <SetEmailPassword
        mode={mode}
        email={email}
        password={password}
        isEmailValid={isEmailValid}
        currentStrings={currentStrings}
        setEmail={setEmail}
        setPassword={setPassword}
        emailSignUp={emailSignUp}
        onChangeMode={onForgotPassword}
      />
    );
  }

  return (
    <View className="flex flex-col content-center items-center justify-center flex-1 w-full gap-y-5">
      <Title1>{currentStrings.head}</Title1>
      {currentStrings.sub && <Title2>{currentStrings.sub}</Title2>}
      <View className="flex flex-col justify-center items-center gap-y-5 w-full relative">
        <Input
          value={email}
          onChange={setEmail}
          placeholder={strings.emailHolder}
          keyboardType={KeyboardTypes.emailAddress}
          className="w-80"
        />
        <ThemedButton
          text={strings.login}
          disabled={!isEmailValid}
          theme="filled"
          onPress={setStep}
          classCustomBody="w-80"
        />
        <View>
          <Title2>{currentStrings.alt1}</Title2>
          <TextButton onPress={onChangeMode}>{currentStrings.alt2}</TextButton>
        </View>
      </View>
      <TextBold className="text-title-gray font-extrabold text-base">
        {strings.or}
      </TextBold>
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
