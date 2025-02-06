import React from 'react';
import {View} from 'react-native';
import {useRoute} from '@react-navigation/native';
import TopBar from '../top-bar/top-bar';

const ScreenWrapper: React.FC<{children: React.ReactNode}> = ({children}) => {
  const route = useRoute(); // Get current screen name

  return (
    <View className="flex-1">
      <TopBar currentScreen={route.name} />
      <View className="flex-1">{children}</View>
    </View>
  );
};

export default ScreenWrapper;
