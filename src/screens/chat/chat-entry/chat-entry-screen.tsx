import React from 'react';
import {View} from 'react-native';
import ChatList from '../chat-list/chat-list';
import {CreateChatAccount} from '../create-chat-account';
import {ChatEntryScreenState} from './chat-entry-screen.state';

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
  const {publicChatKey} = ChatEntryScreenState();
  // TODO: remove publicChatKey from the check below after then all users are going to be updated with the new public/private key
  return (
    <View className="flex-1">
      {publicChatKey ? <ChatList chatData={chatData} /> : <CreateChatAccount />}
    </View>
  );
};

export default ChatListScreen;
