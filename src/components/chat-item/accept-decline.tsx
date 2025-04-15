import React, {useContext} from 'react';
import {View, TouchableOpacity} from 'react-native';
import {AcceptIcon} from '../../assets/icons/acceptIcon';
import {DeclineIcon} from '../../assets/icons/declineIcon';
import {TextNormal} from '../text-styled';
import {ChatSocketProviderContext} from '../../services/context/chat/chat-context-provider';

interface AcceptDeclineProps {
  chatId: string;
}

export const AcceptDecline: React.FC<AcceptDeclineProps> = ({chatId}) => {
  const {handleJoinChat, handleDeclineChatRoomInvitation} = useContext(
    ChatSocketProviderContext,
  );

  const onHandleChatJoin = () => {
    handleJoinChat({chatId});
  };

  const onHandleDeclineChatRoomInvitation = () =>
    handleDeclineChatRoomInvitation({chatId});

  return (
    <View className="flex-row items-center space-x-1 p-2 border-gray-200 border rounded-md">
      <TextNormal className="color-gray-400">New</TextNormal>
      <TouchableOpacity
        className="flex-row items-center"
        onPress={onHandleChatJoin}>
        <View className="w-6 h-6 bg-emerald-700 rounded-full items-center justify-center">
          <AcceptIcon />
        </View>
      </TouchableOpacity>
      <TouchableOpacity
        className="flex-row items-center"
        onPress={onHandleDeclineChatRoomInvitation}>
        <View className="w-6 h-6 bg-input-error rounded-full items-center justify-center">
          <DeclineIcon />
        </View>
      </TouchableOpacity>
    </View>
  );
};
