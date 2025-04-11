import React from 'react';
import {View, TouchableOpacity} from 'react-native';
import {AcceptIcon} from '../../assets/icons/acceptIcon';
import {DeclineIcon} from '../../assets/icons/declineIcon';
import {TextNormal} from '../text-styled';

interface AcceptDeclineProps {}

export const AcceptDecline: React.FC<AcceptDeclineProps> = () => {
  return (
    <View className="flex-row items-center space-x-1 p-2 border-gray-200 border rounded-md">
      <TextNormal className="color-gray-400">New</TextNormal>
      <TouchableOpacity className="flex-row items-center">
        <View className="w-6 h-6 bg-emerald-700 rounded-full items-center justify-center">
          <AcceptIcon />
        </View>
      </TouchableOpacity>
      <TouchableOpacity className="flex-row items-center">
        <View className="w-6 h-6 bg-input-error rounded-full items-center justify-center">
          <DeclineIcon />
        </View>
      </TouchableOpacity>
    </View>
  );
};
