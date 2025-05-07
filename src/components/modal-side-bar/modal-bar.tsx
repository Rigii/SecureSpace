import React, {useState} from 'react';
import {View, TouchableOpacity, FlatList} from 'react-native';
import {SidebarIcon} from '../../assets/icons';
import {TextNormal} from '../text-titles/text-styled';
import ModalPopup from '../modal-popup/modal-popup';
import {ITopBarMenuActions} from '../../HOC/combined-component/combined-component';

export interface ISidebarProps {
  data: ITopBarMenuActions[];
}

const DropdownButton: React.FC<ISidebarProps> = ({data}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleSidebarPress = () => {
    setIsDropdownOpen(prev => !prev);
  };

  if (!data) {
    return null;
  }

  const optionsListComponent = (
    <FlatList
      data={data}
      renderItem={({item}: {item: ITopBarMenuActions}) => (
        <TouchableOpacity
          className="flex-row items-center mb-2"
          onPress={() => {
            item.action();
            setIsDropdownOpen(false);
          }}>
          {item.icon}
          <TextNormal className="text-white ml-2">{item.label}</TextNormal>
        </TouchableOpacity>
      )}
      keyExtractor={item => item.id}
    />
  );

  return (
    <View className="relative">
      <TouchableOpacity onPress={handleSidebarPress}>
        <SidebarIcon />
      </TouchableOpacity>
      <ModalPopup
        content={optionsListComponent}
        wrapperClass="absolute top-32 left-4 bg-gray-900 p-3 rounded-lg w-48"
        isOpen={isDropdownOpen}
        setisModalOpen={setIsDropdownOpen}
      />
    </View>
  );
};

export default DropdownButton;
