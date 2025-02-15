import React from 'react';
import {View, FlatList} from 'react-native';
import ChatListItem from '../../components/chat-item/chat-item';
import {useReduxSelector} from '../../app/store/store';

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

// export interface IChatRoomId {
//   chatId: string;
//   date: Date;
//   updateDate: Date;
//   isOwner: boolean;
//   roomType: string;
//   chatRoomName: string;
// }

const ChatList: React.FC = () => {
  const userChatsData = useReduxSelector(state => state.userChatsSlice);

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
