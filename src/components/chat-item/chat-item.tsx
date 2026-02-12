import React from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import {AcceptDecline} from './accept-decline';
import {IChatRoom} from '../../app/store/state/chat-rooms-content/chat-rooms-state.types';

interface ChatListItemProps {
  chatItemData: IChatRoom;
  interlocutorId: string;
  unreadMessages: boolean;
  navigateToChatRoom: (chatId: string) => void;
}

const ChatListItem: React.FC<ChatListItemProps> = ({
  chatItemData,
  interlocutorId,
  unreadMessages,
  navigateToChatRoom,
}) => {
  const isInvitationAccepted =
    chatItemData?.invitedUserIds?.includes(interlocutorId);

  const onNavigateToChatRoom = () => {
    navigateToChatRoom(chatItemData.id);
  };

  const chatMessages = chatItemData.messages || [];

  return (
    <TouchableOpacity
      className="flex-row items-center justify-center p-3 border-b border-gray-200"
      onPress={onNavigateToChatRoom}>
      <View className="w-10 h-10 bg-gray-300 rounded-full mr-4" />
      <Text className="flex-1 text-lg font-bold text-black">
        {chatItemData.chatName}
      </Text>

      <View className="flex-row gap-x-3 items-center">
        <View className="flex-col items-end">
          {chatMessages[0] && (
            <Text className="text-gray-500 text-xs">
              {chatMessages[0]?.created}
            </Text>
          )}
          {isInvitationAccepted && <AcceptDecline chatId={chatItemData.id} />}
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
