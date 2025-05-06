/* Copolot write here RN dropdown component with the list of options */

import React, {useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from 'react-native';
import {RootStackParamList} from '../../app/navigator/screens';
import {NavigationProp, useNavigation} from '@react-navigation/native';
import {SidebarIcon} from '../../assets/icons';
import {FlatList} from 'react-native-gesture-handler';
import {ISidebarDropdownDataSet} from './sidebar.types';
import {sidebarDropdownDataSets} from './sidebar.constants';

export type TSidebarProps = {
  currentScreen: string;
};

const Sidebar: React.FC<TSidebarProps> = ({currentScreen}) => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleOutsidePress = () => {
    if (isDropdownOpen) {
      setIsDropdownOpen(false);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={handleOutsidePress}>
      <TouchableOpacity>
        <SidebarIcon />
      </TouchableOpacity>
      {isDropdownOpen && (
        <View className="col w-10 content-center items-center p-3 gap-3 mt-10 absolute left-0 bg-gray-900">
          <FlatList
            data={sidebarDropdownDataSets.chatListSet}
            renderItem={({item}: {item: ISidebarDropdownDataSet}) => (
              <TouchableOpacity
                className="flex-row items-center gap-2"
                onPress={item.action}>
                {item.icon}
                <Text className="text-white">{item.label}</Text>
              </TouchableOpacity>
            )}
            keyExtractor={item => item.label}
          />
        </View>
      )}
    </TouchableWithoutFeedback>
  );
};
export default Sidebar;
