import React, {useState} from 'react';
import {View, TouchableOpacity, FlatList} from 'react-native';
import {TextNormal} from '../text-titles/text-styled';
import ModalPopup from '../modal-popup/modal-popup';
import {ActiveUsersIcon} from '../../assets/icons/activeUsersIcon';

export interface IInterlocutorListProps {
  data: {
    icon: React.ReactNode;
    label: string;
    isActive: boolean;
    action: () => void;
    id: string;
  }[];
  popupClassName?: string;
  buttonClassName?: string;
}

const InterlocutorList: React.FC<IInterlocutorListProps> = ({
  data,
  popupClassName,
  buttonClassName,
}) => {
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
      className="max-w-sm"
      renderItem={({
        item,
      }: {
        item: {
          icon: React.ReactNode;
          label: string;
          action: () => void;
          id: string;
          isActive: boolean;
        };
      }) => (
        <TouchableOpacity
          className="flex-row items-center mb-2 w-60"
          onPress={() => {
            item.action();
            setIsDropdownOpen(false);
          }}>
          {item.icon}

          <TextNormal
            numberOfLines={1}
            ellipsizeMode="tail"
            className="text-white ml-2 flex-1">
            {item.label}
          </TextNormal>
        </TouchableOpacity>
      )}
      keyExtractor={item => item.id}
    />
  );

  return (
    <View className={`relative ${buttonClassName}`}>
      <TouchableOpacity onPress={handleSidebarPress}>
        <ActiveUsersIcon />
      </TouchableOpacity>
      <ModalPopup
        content={optionsListComponent}
        wrapperClass={`absolute top-32 bg-gray-900 p-3 rounded-lg ${popupClassName}`}
        isOpen={isDropdownOpen}
        setisModalOpen={setIsDropdownOpen}
      />
    </View>
  );
};

export default InterlocutorList;
