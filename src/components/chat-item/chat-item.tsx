import React from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import {AcceptDecline} from './accept-decline';
import {IChatRoom} from '../../app/store/state/chatRoomsContent/chatRoomsState.types';

interface ChatListItemProps {
  chatItemData: IChatRoom;
  interlocutorId: string;
  lastMessageTime: string;
  unreadMessages: boolean;
}

const ChatListItem: React.FC<ChatListItemProps> = ({
  chatItemData,
  interlocutorId,
  lastMessageTime,
  unreadMessages,
}) => {
  const isInvitationAccepted =
    chatItemData?.invitedUserIds.includes(interlocutorId);

  return (
    <TouchableOpacity className="flex-row items-center justify-center p-3 border-b border-gray-200">
      <View className="w-10 h-10 bg-gray-300 rounded-full mr-4" />
      <Text className="flex-1 text-lg font-bold text-black ">
        {chatItemData.chatName}
      </Text>

      <View className="flex-row gap-x-3 items-center">
        <View className="flex-col items-end">
          <Text className="text-gray-500 text-xs">{lastMessageTime}</Text>
          {isInvitationAccepted && <AcceptDecline />}
        </View>
        <View
          className={`w-3 h-3 rounded-full ${
            unreadMessages ? 'bg-green-500' : 'bg-gray-400'
          }`}
        />
      </View>
    </TouchableOpacity>
  );
};

export default ChatListItem;
