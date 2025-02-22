import React from 'react';
import {View} from 'react-native';
import {useReduxSelector} from '../../app/store/store';
import ChatList from './chat-list';
import {CreateChatAccount} from './create-chat-account';

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

const ChatListScreen: React.FC = () => {
  const userChatsData = useReduxSelector(state => state.userChatsReducer);

  return (
    <View className="flex-1">
      {userChatsData?.accountId ? (
        <ChatList chatData={chatData} />
      ) : (
        <CreateChatAccount />
      )}
    </View>
  );
};

export default ChatListScreen;
