import React from 'react';
import {View} from 'react-native';
import {CreateChatAccount} from '../create-chat-account';
import {ChatEntryScreenState} from './chat-entry-screen.state';
import {chatData} from './chat-rooms.mocked';
import ChatList from '../chat-list/chat-list';

const ChatListScreen: React.FC = () => {
  const {publicChatKey} = ChatEntryScreenState();
  // TODO: remove publicChatKey from the check below after then all users are going to be updated with the new public/private keys
  return (
    <View className="flex-1">
      {publicChatKey ? <ChatList chatData={chatData} /> : <CreateChatAccount />}
    </View>
  );
};

export default ChatListScreen;
