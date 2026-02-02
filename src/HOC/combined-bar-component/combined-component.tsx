// withTopBar.tsx
import React from 'react';
import {SafeAreaView} from 'react-native';
import {useRoute} from '@react-navigation/native';
import TopBar from '../../components/top-bar/app-top-bap/app-top-bar';
import {TapplicationScreens} from '../../app/navigator/screens';

export interface ITopBarMenuActions {
  id: string;
  label: string;
  icon?: React.ReactNode;
  action: () => void;
}

interface WithTopBarOptions {
  actions?: ITopBarMenuActions[];
}

export const combineWithBarHOC = (
  WrappedComponent: React.ComponentType<any>,
  options?: WithTopBarOptions,
) => {
  const EnhancedComponent: React.FC<any> = props => {
    const [actions, setActions] = React.useState(options?.actions || []);

    const route = useRoute();
    const currentScreen = route.name as TapplicationScreens;

    return (
      <>
        <SafeAreaView className="bg-gray-900 overflow-auto">
          <TopBar currentScreen={currentScreen} menuActions={actions} />
        </SafeAreaView>
        <WrappedComponent {...props} injectActions={setActions} />
      </>
    );
  };

  return EnhancedComponent;
};
