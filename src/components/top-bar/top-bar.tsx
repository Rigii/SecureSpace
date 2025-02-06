import React from 'react';
import {View, TouchableOpacity} from 'react-native';
import Svg, {Path} from 'react-native-svg';
import {manualEncryptionScreenRoutes} from '../../app/navigator/screens';

const TopBar = ({currentScreen}: {currentScreen: string}) => {
  const rightButtonRedirectionComponent = () => {
    if (currentScreen === manualEncryptionScreenRoutes.chatList) {
      return (
        <TouchableOpacity>
          <Svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round">
            <Path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
            <Path d="M9 22V12h6v10" />
          </Svg>
        </TouchableOpacity>
      );
    }
    return (
      <TouchableOpacity>
        <Svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="white"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round">
          <Path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
          <Path d="M9 22V12h6v10" />
        </Svg>
      </TouchableOpacity>
    );
  };

  return (
    <View className="flex-row items-center justify-between px-4 py-3 bg-gray-900">
      {/* Navigation Toggle (Left) */}
      <TouchableOpacity>
        <Svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="white"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round">
          <Path d="M3 12h18M3 6h18M3 18h18" />
        </Svg>
      </TouchableOpacity>

      {/* Right Side Icons */}
      <View className="flex-row gap-4">
        {/* User Account Toggle */}
        <TouchableOpacity>
          <Svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round">
            <Path d="M16 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
            <Path d="M12 11a4 4 0 1 0-8 0 4 4 0 0 0 8 0z" />
          </Svg>
        </TouchableOpacity>

        {rightButtonRedirectionComponent()}
      </View>
    </View>
  );
};

export default TopBar;
