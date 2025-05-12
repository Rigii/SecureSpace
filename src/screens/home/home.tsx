import * as React from 'react';
import {NavigationProp, useNavigation} from '@react-navigation/native';
import {
  RootStackParamList,
  manualEncryptionScreenRoutes,
} from '../../app/navigator/screens';
import {View} from 'react-native';
import {ThemedButton} from '../../components/themed-button';
import {combineWithBarHOC} from '../../HOC/combined-bar-component/combined-component';
import {dropdownActions} from './mocked';

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

export const CombinedBarHome = combineWithBarHOC(Home, {
  actions: dropdownActions,
});
