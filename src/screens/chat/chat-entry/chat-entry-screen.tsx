import React from 'react';
import {View} from 'react-native';
import {CreateChatAccount} from '../create-chat-account';
import {ChatEntryScreenState} from './chat-entry-screen.state';
import {chatData} from './chat-rooms.mocked';
import ChatList from '../chat-list/chat-list';
import {combineWithBarHOC} from '../../../HOC/combined-component/combined-component';

const actions = [
  {
    id: 'chatListSearch',
    label: 'Search',
    icon: '',
    action: () => null,
  },
  {
    id: 'chatListCreateRoom',
    label: 'Create Room',
    icon: '',
    action: () => null,
  },
  {
    id: 'chatListSettings',
    label: 'Account & Settings',
    icon: '',
    action: () => null,
  },
];

const ChatListScreen: React.FC = () => {
  const {publicChatKey} = ChatEntryScreenState();
  // TODO: remove publicChatKey from the check below after then all users are going to be updated with the new public/private keys
  return (
    <View className="flex-1">
      {publicChatKey ? <ChatList chatData={chatData} /> : <CreateChatAccount />}
    </View>
  );
};

export const CombinedChatListScreen = combineWithBarHOC(ChatListScreen, {
  actions,
});
