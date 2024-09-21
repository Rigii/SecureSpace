import React, {useEffect, useState} from 'react';
import {Text, View} from 'react-native';
import {strings} from '../../constants/strings/spinner.strings';

const randomHints = [
  strings.ransomwareAttacks,
  strings.cybercrimeAffected,
  strings.gartnerReports,
  strings.costDataBreachReport,
  strings.reportCybersecurityInsidersFound,
  strings.affectedBySolarWinds,
];

export const SpinnerHint: React.FC = () => {
  const [hint, setHint] = useState<string>();

  const returnRandomHint = () => {
    const randomHint =
      randomHints[Math.floor(Math.random() * randomHints?.length)];
    setHint(randomHint);
  };

  useEffect(() => {
    if (!hint) {
      return returnRandomHint();
    }
    const interval = setInterval(() => returnRandomHint(), 5000);
    return () => {
      clearInterval(interval);
    };
  }, [hint]);

  if (!hint) {
    return <></>;
  }

  return (
    <View className="animate-pulse flex flex-col gap-y-7 mt-5 mb-5 dark:bg-background-black border-gray-700 rounded-xl sm:p-10 p-4 border-solid border-2 max-w-lg">
      <Text className="dark:text-gray-500 text-gray-600 sm:text-md text-md">
        {hint}
      </Text>
    </View>
  );
};
