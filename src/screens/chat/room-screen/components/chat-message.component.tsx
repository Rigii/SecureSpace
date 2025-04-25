import React from 'react';
import {View, Text} from 'react-native';

type ChatMessageProps = {
  message: string;
  isOwnMessage?: boolean;
  senderName?: string;
  time?: string;
};

export const ChatMessage: React.FC<ChatMessageProps> = ({
  message,
  isOwnMessage = false,
  senderName,
  time,
}) => {
  return (
    <View
      className={`flex flex-col mb-2 px-3 ${
        isOwnMessage ? 'items-end' : 'items-start'
      }`}>
      {senderName && !isOwnMessage && (
        <Text className="text-xs text-gray-500 mb-1">{senderName}</Text>
      )}

      <View
        className={`max-w-[80%] px-4 py-2 rounded-2xl shadow-sm ${
          isOwnMessage
            ? 'bg-blue-500 rounded-tr-none'
            : 'bg-gray-200 rounded-tl-none'
        }`}>
        <Text
          className={`text-base ${isOwnMessage ? 'text-white' : 'text-black'}`}>
          {message}
        </Text>
      </View>

      {time && <Text className="text-[10px] text-gray-400 mt-1">{time}</Text>}
    </View>
  );
};
