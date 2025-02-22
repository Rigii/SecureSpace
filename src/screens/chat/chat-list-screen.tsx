import React from 'react';
import {View} from 'react-native';
import ChatList from './chat-list';
import {CreateChatAccount} from './create-chat-account';
import {ChatListScreenState} from './chat-list-screen.state';

const chatData = [
  {
    id: '1',
    chatName: 'Family Group',
    lastMessageTime: '10:45 AM',
    unreadMessages: true,
  },
  {
    id: '2',
    chatName: 'Work Chat',
    lastMessageTime: 'Yesterday',
    unreadMessages: false,
  },
  {
    id: '3',
    chatName: 'Best Friend',
    lastMessageTime: '5:30 PM',
    unreadMessages: true,
  },
  {
    id: '4',
    chatName: 'Developers',
    lastMessageTime: 'Monday',
    unreadMessages: false,
  },
];

const ChatListScreen: React.FC = () => {
  const {accountId} = ChatListScreenState();
  return (
    <View className="flex-1">
      {accountId ? <ChatList chatData={chatData} /> : <CreateChatAccount />}
    </View>
  );
};

export default ChatListScreen;
