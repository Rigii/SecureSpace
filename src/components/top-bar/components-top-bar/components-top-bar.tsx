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
        <TouchableOpacity onPress={navigateBack}>
          <BackIcon />
        </TouchableOpacity>
        <View className="flex-row">
          <View className="mr-3">
            <TouchableOpacity>
              <LogoutSmallIcon />
            </TouchableOpacity>
          </View>
          <DropdownButton data={settingsData} popupClassName="right-4" />
        </View>
      </View>
    </SafeAreaView>
  );
};

export default ComponentsTopBar;
