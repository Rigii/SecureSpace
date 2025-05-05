import React from 'react';
import {View, FlatList} from 'react-native';
import ChatListItem from '../../../components/chat-item/chat-item';
import {UseChatListState} from './chat-list.state';
import {NavigationProp, useNavigation} from '@react-navigation/native';
import {
  RootStackParamList,
  manualEncryptionScreenRoutes,
} from '../../../app/navigator/screens';
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
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const {chatRoomsArray, interlocutorId} = UseChatListState();

  const navigateCreateChat = () => {
    navigation.navigate(manualEncryptionScreenRoutes.createChatRoom);
  };

  const navigateToChatRoom = (chatId: string) => {
    navigation.navigate(manualEncryptionScreenRoutes.chatRoom, {
      chatId,
      participantId: interlocutorId,
    });
  };

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
            lastMessageTime={
              item.messages && item.messages?.length > 0
                ? new Date(item.messages[0].created).toLocaleString()
                : '12.08.2025'
            }
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
