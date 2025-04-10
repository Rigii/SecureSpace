import React from 'react';
import {View, FlatList} from 'react-native';
import ChatListItem from '../../../components/chat-item/chat-item';
import {ChatListState} from './chat-list.state';
import {PlusButton} from '../../../components/themed-button/plus-button';
import {NavigationProp, useNavigation} from '@react-navigation/native';
import {
  RootStackParamList,
  manualEncryptionScreenRoutes,
} from '../../../app/navigator/screens';

interface ChatListProps {
  chatData: {
    id: string;
    chatName: string;
    lastMessageTime: string;
    unreadMessages: boolean;
  }[];
}

const ChatList: React.FC<ChatListProps> = ({chatData}) => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const {chatRoomsArray} = ChatListState();

  const navigateCreateChat = () => {
    navigation.navigate(manualEncryptionScreenRoutes.createChatRoom);
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
            chatName={item.chatName}
            lastMessageTime={
              item.messages.length > 0 ? item.messages[0].created : ''
            }
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
