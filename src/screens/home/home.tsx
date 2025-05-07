import * as React from 'react';
import {NavigationProp, useNavigation} from '@react-navigation/native';
import {
  RootStackParamList,
  manualEncryptionScreenRoutes,
} from '../../app/navigator/screens';
import {View} from 'react-native';
import {ThemedButton} from '../../components/themed-button';
import {combineWithBarHOC} from '../../HOC/combined-component/combined-component';

const actions = [
  {
    id: 'homeSearch',
    label: 'Search',
    icon: '',
    action: () => console.log('Search'),
  },
  {
    id: 'homeSettings',
    label: 'Settings',
    icon: '',
    action: () => console.log('Settings'),
  },
  {
    id: 'homeStorage',
    label: 'Storage',
    icon: '',
    action: () => console.log('Storage'),
  },
  {
    id: 'homeCreateDocument',
    label: 'Create Document',
    icon: '',
    action: () => console.log('Create Document'),
  },
];

export const Home = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  return (
    <View>
      <ThemedButton
        text={'Chat List'}
        onPress={() =>
          navigation.navigate(manualEncryptionScreenRoutes.chatList)
        }
        theme={'filled'}
      />
    </View>
  );
};

export const CombinedBarHome = combineWithBarHOC(Home, {actions});
