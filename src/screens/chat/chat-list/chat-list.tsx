import React from 'react';
import {View, FlatList} from 'react-native';
import ChatListItem from '../../../components/chat-item/chat-item';
import {useChatListState} from './chat-list.state';

import {PlusButton} from '../../../components/themed-button';

interface ChatListProps {
  chatData: {
    id: string;
    chatName: string;
    lastMessageTime: string;
    unreadMessages: boolean;
  }[];
}

const ChatList: React.FC<ChatListProps> = () => {
  const {
    chatRoomsArray,
    interlocutorId,
    navigateCreateChat,
    navigateToChatRoom,
  } = useChatListState();

  if (!chatRoomsArray) {
    return null;
  }

  return (
    <View className="flex-1">
      <FlatList
        data={chatRoomsArray}
        keyExtractor={item => item.id}
        renderItem={({item}) => (
          <ChatListItem
            chatItemData={item}
            interlocutorId={interlocutorId}
            navigateToChatRoom={navigateToChatRoom}
            unreadMessages={false}
          />
        )}
        showsVerticalScrollIndicator={false}
      />
      <View className="absolute bottom-5 left-0 right-0">
        <PlusButton onPress={navigateCreateChat} />
      </View>
    </View>
  );
};

export default ChatList;
