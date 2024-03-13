import React from 'react';
// import {ISetAccountDetails} from 'components/OnBoarding/CreateAccount/CreateAccount.types';
// import {EAuthMode} from '../encryptionAuth.types';
import {useLoginSignUpUserState} from './login-signup.state';
// import SetEmailPassword from './SetEmailPassword';
import {strings} from '../../constants/strings/login-signup.strings';
import {Input, KeyboardTypes} from '../../components/input';
import {ThemedButton} from '../../components/themed-button';
import {GoogleIcon, OutlookIcon} from '../../assets/icons';
import {Text, TouchableOpacity, View} from 'react-native';
import SetEmailPassword from './set-email-password';

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
    <View className="flex flex-col content-center items-center justify-center flex-1 gap-10">
      <Text className="mb-3 dark:text-white text-center gap-10">
        {currentStrings.head}
      </Text>
      {currentStrings.sub && (
        <Text className="text-title-gray font-extrabold text-s mt-2 inline-flex justify-center items-center gap-10">
          {currentStrings.sub}
        </Text>
      )}
      <View className="flex flex-col justify-center items-center gap-3 mb-20 flex-wrap pt-14 gap-10">
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
        <Text className="text-title-gray font-extrabold text-s mt-2 w-80 inline-flex justify-center items-center gap-10">
          {currentStrings.alt1}
        </Text>
        <TouchableOpacity
          onPress={onChangeMode}
          className={
            'text-light-blue flex w-max font-extrabold text-s width-content pl-2'
          }>
          <Text>{currentStrings.alt2}</Text>
        </TouchableOpacity>
      </View>
      <View>
        <Text
          className="text-title-gray font-extrabold text-s w-80
            inline-flex justify-center items-center mt-4 mb-2
          before:height-2 before:border before:w-full before:mr-2
          after:height-2 after:border after:w-full after:ml-2
          ">
          {strings.or}
        </Text>
      </View>
      <ThemedButton
        classCustomBody="bg-soft-blue w-80 h-12 rounded-sm"
        text={strings.enterWithGoogle}
        theme="lightBordered"
        // rightContent={<GoogleIcon />}
        onPress={onGoogleSignUp}
      />
      <ThemedButton
        classCustomBody="bg-dark-blue pl-[1.3rem] w-80 h-12 rounded-sm gap-10"
        text={strings.enterWithOutlook}
        theme="lightBordered"
        // rightContent={<OutlookIcon />}
        onPress={onMicrosoftSignUp}
      />
    </View>
  );
};
