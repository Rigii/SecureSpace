import React from 'react';
// import {ISetAccountDetails} from 'components/OnBoarding/CreateAccount/CreateAccount.types';
// import {EAuthMode} from '../encryptionAuth.types';
import {useLoginSignUpUserState} from './login-signup.state';
// import SetEmailPassword from './SetEmailPassword';
import {strings} from '../../constants/strings/login-signup.strings';
import {Input, KeyboardTypes} from '../../components/input';
import {ThemedButton} from '../../components/themed-button';
import {GoogleIcon, OutlookIcon} from '../../assets/icons';
import {Text, View} from 'react-native';
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
    <View className="flex flex-col content-center items-center justify-center flex-1 w-full p-5">
      <Title1>{currentStrings.head}</Title1>
      {currentStrings.sub && <Title2>{currentStrings.sub}</Title2>}
      <View className="flex flex-col justify-center items-center gap-3 mb-20 flex-wrap pt-14 w-full">
        <Input
          value={email}
          onChange={setEmail}
          placeholder={strings.emailHolder}
          keyboardType={KeyboardTypes.emailAddress}
          classStyles="w-80 rounded-sm h-12"
        />
        <ThemedButton
          text={strings.login}
          disabled={!isEmailValid}
          theme="filled"
          onPress={setStep}
          classCustomBody="w-80 h-12 rounded-sm"
        />
        <Title2 className="text-title-gray font-extrabold text-s mt-2 w-80 inline-flex justify-center items-center">
          {currentStrings.alt1}
        </Title2>
        <TextButton
          className={'flex w-max width-content'}
          onPress={onChangeMode}>
          {currentStrings.alt2}
        </TextButton>
      </View>
      <View>
        <TextBold
          className="text-title-gray font-extrabold text-s w-80
            inline-flex justify-center items-center mt-4 mb-2
          before:height-2 before:border before:w-full before:mr-2
          after:height-2 after:border after:w-full after:ml-2
          ">
          {strings.or}
        </TextBold>
      </View>
      <ThemedButton
        classCustomBody="bg-soft-blue w-80 h-12 rounded-sm"
        text={strings.enterWithGoogle}
        theme="lightBordered"
        // rightContent={<GoogleIcon />}
        onPress={onGoogleSignUp}
      />
      <ThemedButton
        classCustomBody="bg-dark-blue pl-[1.3rem] w-80 h-12 rounded-sm"
        text={strings.enterWithOutlook}
        theme="lightBordered"
        // rightContent={<OutlookIcon />}
        onPress={onMicrosoftSignUp}
      />
    </View>
  );
};
