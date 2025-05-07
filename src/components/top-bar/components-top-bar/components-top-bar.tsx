import React from 'react';
import {View, TouchableOpacity, SafeAreaView} from 'react-native';
import {RootStackParamList} from '../../../app/navigator/screens';
import {NavigationProp, useNavigation} from '@react-navigation/native';
import {LogoutSmallIcon} from '../../../assets/icons';
import DropdownButton from '../../modal-side-bar/modal-bar';
import {BackIcon} from '../../../assets/icons/backIcon';
import {ISidebarDropdownDataSet} from '../../modal-side-bar/modal-bar.types';

const ComponentsTopBar = ({
  settingsData,
}: {
  settingsData: ISidebarDropdownDataSet[];
}) => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  const navigateBack = () => {
    navigation.goBack();
  };

  return (
    <SafeAreaView className="bg-gray-900 overflow-auto">
      <View className="relative flex-row items-center justify-between px-4 py-3">
        <DropdownButton data={settingsData} />

        <View className="flex-row gap-4">
          <TouchableOpacity>
            <LogoutSmallIcon />
          </TouchableOpacity>
          <TouchableOpacity onPress={navigateBack}>
            <BackIcon />
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default ComponentsTopBar;
