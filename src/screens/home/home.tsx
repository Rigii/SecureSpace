import * as React from 'react';
import {NavigationProp, useNavigation} from '@react-navigation/native';
import {
  RootStackParamList,
  manualEncryptionScreenRoutes,
} from '../../app/navigator/screens';
import {View} from 'react-native';
import {ThemedButton} from '../../components/themed-button';
import {
  ITopBarMenuActions,
  combineWithBarHOC,
} from '../../HOC/combined-bar-component/combined-component';
import {useEffect} from 'react';
import {strings} from './home.strings';

export const Home: React.FC<{
  injectActions?: (actions: ITopBarMenuActions[]) => void;
}> = ({injectActions}) => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  useEffect(() => {
    const navigateSettings = () => {
      navigation.navigate(manualEncryptionScreenRoutes.accountSettings);
    };

    const dropdownActions = [
      {
        id: 'homeSearch',
        label: strings.search,
        icon: '',
        action: () => console.log(strings.search),
      },
      {
        id: 'homeSettings',
        label: strings.accountSettings,
        icon: '',
        action: navigateSettings,
      },
      {
        id: 'homeStorage',
        label: strings.storage,
        icon: '',
        action: () => console.log(strings.storage),
      },
      {
        id: 'homeCreateDocument',
        label: strings.createDocument,
        icon: '',
        action: () => console.log(strings.createDocument),
      },
    ];

    injectActions?.(dropdownActions);
  }, [injectActions, navigation]);

  return (
    <View>
      <ThemedButton
        text={strings.chatList}
        onPress={() =>
          navigation.navigate(manualEncryptionScreenRoutes.chatList)
        }
        theme={'filled'}
      />
    </View>
  );
};

export const CombinedBarHome = combineWithBarHOC(Home);
