import {strings} from '../../constants/strings/login-signup.strings';
import React, {ReactElement} from 'react';
import {Input, KeyboardTypes} from '../../components/input';
import {ThemedButton} from '../../components/themed-button';
import {EAuthMode} from './login-sign-up.types';
import {Text, TouchableOpacity, View} from 'react-native';

export default function SetEmailPassword({
  email,
  password,
  isEmailValid,
  currentStrings,
  mode,
  setEmail,
  setPassword,
  emailSignUp,
  onChangeMode,
}: {
  email: string;
  password: string;
  isEmailValid: boolean;
  currentStrings: {
    [key: string]: string;
  };
  mode: EAuthMode;
  setEmail: React.Dispatch<React.SetStateAction<string>>;
  setPassword: React.Dispatch<React.SetStateAction<string>>;
  emailSignUp: () => void;
  onChangeMode: () => void;
}): ReactElement {
  return (
    <View className="flex flex-col content-center items-center justify-center flex-1">
      <Text className="mb-3 dark:text-white text-center">
        {currentStrings.head}
      </Text>
      {currentStrings.sub && (
        <Text className="text-title-gray font-extrabold text-s mt-2 inline-flex justify-center items-center">
          {currentStrings.sub}
        </Text>
      )}

      <View className="flex flex-col justify-center items-center gap-3 mb-20 flex-wrap pt-14">
        <Input
          value={email}
          onChange={setEmail}
          placeholder={strings.emailHolder}
          keyboardType={KeyboardTypes.emailAddress}
          classStyles="w-80 rounded-sm h-12"
        />
        <Input
          isSecure={true}
          keyboardType={KeyboardTypes.default}
          value={password}
          onChange={setPassword}
          placeholder={strings.passwordHolder}
          classStyles="w-80 rounded-sm h-12"
        />
        <ThemedButton
          text={strings.continue}
          disabled={!isEmailValid}
          theme="lightBordered"
          onPress={emailSignUp}
          classCustomBody="w-80 h-12 rounded-sm"
        />
        <Text className="text-title-gray font-extrabold text-s mt-2 w-80 inline-flex justify-center items-center">
          {currentStrings.alt1}
          <TouchableOpacity
            onPress={onChangeMode}
            className={
              'text-light-blue flex w-max font-extrabold text-s width-content pl-2'
            }>
            {currentStrings.alt2}
          </TouchableOpacity>
        </Text>
        {mode === EAuthMode.logIn && (
          <Text className="text-title-gray font-extrabold text-s mt-2 w-80 inline-flex justify-center items-center">
            {strings.forgotYourPassword}
            <TouchableOpacity
              onPress={onChangeMode}
              id="forgot-password"
              className={
                'text-light-blue flex w-max font-extrabold text-s width-content pl-2'
              }>
              {strings.reset}
            </TouchableOpacity>
          </Text>
        )}
      </View>
    </View>
  );
}
