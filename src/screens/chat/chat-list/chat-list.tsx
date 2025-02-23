import React from 'react';
import {View, FlatList} from 'react-native';
import ChatListItem from '../../../components/chat-item/chat-item';
import {ChatListState} from './chat-list.state';

interface ChatListProps {
  chatData: {
    id: string;
    chatName: string;
    lastMessageTime: string;
    unreadMessages: boolean;
  }[];
}

const ChatList: React.FC<ChatListProps> = ({chatData}) => {
  const {chatRooms} = ChatListState();

  if (!chatRooms) {
    return null;
  }

  return (
    <View className="flex-1">
      <FlatList
        data={chatData}
        keyExtractor={item => item.id}
        renderItem={({item}) => (
          <ChatListItem
            chatName={item.chatName}
            lastMessageTime={item.lastMessageTime}
            unreadMessages={item.unreadMessages}
          />
        )}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

export default ChatList;
