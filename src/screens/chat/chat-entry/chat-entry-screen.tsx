import React from 'react';
import {View} from 'react-native';
import {CreateChatAccount} from '../create-chat-account';
import {ChatEntryScreenState} from './chat-entry-screen.state';
import {chatData} from './chat-rooms.mocked';
import ChatList from '../chat-list/chat-list';
import {
  ITopBarMenuActions,
  combineWithBarHOC,
} from '../../../HOC/combined-bar-component/combined-component';

const ChatListScreen: React.FC<{
  injectActions?: (actions: ITopBarMenuActions[]) => void;
}> = ({injectActions}) => {
  const {privateChatKey} = ChatEntryScreenState({injectActions});

  return (
    <View className="flex-1">
      {privateChatKey ? (
        <ChatList chatData={chatData} />
      ) : (
        <CreateChatAccount />
      )}
    </View>
  );
};

export const CombinedChatListScreen = combineWithBarHOC(ChatListScreen);
