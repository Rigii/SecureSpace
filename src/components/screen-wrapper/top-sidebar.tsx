import React from 'react';
import {SafeAreaView} from 'react-native';
import TopBar from '../top-bar/top-bar';
import {manualEncryptionScreenRoutes} from '../../app/navigator/screens';

type TTopSidebarProps = {
  currentRoute: string | null;
};

const TopSidebar: React.FC<TTopSidebarProps> = ({currentRoute}) => {
  if (
    !currentRoute ||
    currentRoute === manualEncryptionScreenRoutes.registerLogin ||
    currentRoute === manualEncryptionScreenRoutes.onboarding
  ) {
    return null;
  }
  return (
    <SafeAreaView className="bg-gray-900">
      <TopBar currentScreen={currentRoute} />
    </SafeAreaView>
  );
};

export default TopSidebar;
