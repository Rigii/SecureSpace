import React from 'react';
import {strings} from '../../../constants/strings/onboarding.strings';
import {View} from 'react-native';
import {Title1, Title2} from '../../../components/title';
import {ThemedButton} from '../../../components/themed-button';

export const WelcomeAboard = ({
  navigateToMain,
}: {
  navigateToMain: () => void;
}) => {
  return (
    <View className="flex flex-col items-center flex-1 p-3 w-screen">
      <Title1>{strings.accountData}</Title1>
      <View className="block flex-1 m-auto items-center justify-center gap-y-5 overflow-scroll">
        <Title1>{strings.welcomeAboard}</Title1>
        <Title2>{strings.nowYouCanStart}</Title2>
      </View>
      <ThemedButton
        text={strings.toTheMainScreen}
        disabled={false}
        theme="filled"
        onPress={navigateToMain}
        classCustomBody="w-80"
      />
    </View>
  );
};
