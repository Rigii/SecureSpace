import React, {useContext} from 'react';
import {View, TouchableOpacity} from 'react-native';
import {AcceptIcon} from '../../assets/icons/acceptIcon';
import {DeclineIcon} from '../../assets/icons/declineIcon';
import {TextNormal} from '../text-titles/text-styled';
import {ChatSocketProviderContext} from '../../context/chat/chat-provider.context';

interface AcceptDeclineProps {
  chatId: string;
}

const strings = {
  newInvitation: 'New invitation',
};

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
    <View className="flex-row items-center space-x-1 p-2 border-gray-200 border rounded-md justify-between">
      <TextNormal className="color-gray-400">
        {strings.newInvitation}
      </TextNormal>
      <View className="flex-row items-center space-x-4">
        <TouchableOpacity
          className="flex-row items-center"
          onPress={onHandleChatJoin}>
          <View className="w-10 h-10 bg-emerald-700 rounded-full items-center justify-center">
            <AcceptIcon />
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          className="flex-row items-center"
          onPress={onHandleDeclineChatRoomInvitation}>
          <View className="w-10 h-10 bg-input-error rounded-full items-center justify-center">
            <DeclineIcon />
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
};
