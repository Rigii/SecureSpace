import React from 'react';
import {View, Text} from 'react-native';

interface ChatListItemProps {
  chatName: string;
  lastMessageTime: string;
  unreadMessages: boolean;
}

const ChatListItem: React.FC<ChatListItemProps> = ({
  chatName,
  lastMessageTime,
  unreadMessages,
}) => {
  return (
    <View className="flex-row items-center p-3 border-b border-gray-200">
      <View className="w-10 h-10 bg-gray-300 rounded-full mr-4" />
      <Text className="flex-1 text-lg font-bold text-black">{chatName}</Text>
      <View className="items-end">
        <Text className="text-gray-500 text-xs">{lastMessageTime}</Text>
        <View
          className={`w-3 h-3 mt-1 rounded-full ${
            unreadMessages ? 'bg-green-500' : 'bg-gray-400'
          }`}
        />
      </View>
    </View>
  );
};

export default ChatListItem;
