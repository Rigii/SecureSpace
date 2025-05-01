import React, {useContext, useEffect} from 'react';
import {View, FlatList, SafeAreaView} from 'react-native';
import {useReduxSelector} from '../../../app/store/store';
import {ChatMessage} from './components/chat-message.component';
import {IChatMessage} from '../../../app/store/state/chatRoomsContent/chatRoomsState.types';
import ChatInput from './components/chat-input.component';
import {connectUserChatNotificationsSocket} from '../../../services/sockets/chat/chat.socket';
import {
  EPopupType,
  ErrorNotificationHandler,
} from '../../../services/ErrorNotificationHandler';
import {strings} from '../../../services/context/chat/chat-provider.strings';
import {socketEvents} from '../../../services/context/chat/chat-context.constants';
import {ChatSocketProviderContext} from '../../../services/context/chat/chat-context-provider';

interface IChatRoomScreen {
  chatId: string;
}

const ChatRoomScreen: React.FC<IChatRoomScreen> = ({chatId}) => {
  const {setCurrentActiveChatId} = useContext(ChatSocketProviderContext);
  const {interlocutorId} = useReduxSelector(
    state => state.userChatAccountReducer,
  );

  useEffect(() => {
    setCurrentActiveChatId(chatId);
    const currentChatSocket = connectUserChatNotificationsSocket(
      interlocutorId,
      [chatId],
    );

    currentChatSocket.on(socketEvents.CONNECT, () => {
      console.log(`${strings.connectedChatWithId} ${chatId}`);
    });

    currentChatSocket.on(socketEvents.DISCONNECT, () => {
      console.log(`${strings.disconnectedChatWithId} ${chatId}`);
    });

    currentChatSocket.on(socketEvents.USER_JOINED_CHAT, () => {
      console.log(`${strings.disconnectedChatWithId} ${chatId}`);
    });

    currentChatSocket.on(socketEvents.USER_LEFT_CHAT, () => {
      console.log(`${strings.disconnectedChatWithId} ${chatId}`);
    });

    currentChatSocket.on(
      socketEvents.CHAT_ROOM_MESSAGE,
      (message: {
        message: string;
        chatRoomId: string;
        senderName: string;
        senderId: string;
        date: string;
      }) => {
        ErrorNotificationHandler({
          type: EPopupType.INFO,
          text1: `${strings.newMessageReceived} ${message}`,
        });
      },
    );

    return () => {
      currentChatSocket.disconnect();
      currentChatSocket.removeAllListeners();
    };
  }, [chatId, interlocutorId, setCurrentActiveChatId]);

  const userChatRooms = useReduxSelector(state => state.chatRoomsReducer);
  const participantId = useReduxSelector(
    state => state.userChatAccountReducer.interlocutorId,
  );

  const {messages} = userChatRooms[chatId];
  const sortedByDateMessages = messages?.sort(
    (a: IChatMessage, b: IChatMessage) =>
      new Date(b.created).getTime() - new Date(a.created).getTime(),
  );

  return (
    <View className="flex-1">
      <FlatList
        data={sortedByDateMessages}
        keyExtractor={item => item.id}
        renderItem={({item}) => (
          <ChatMessage
            message={item.content}
            isOwnMessage={item.participant_id === participantId}
            senderName={item.sender_nik_name}
            time={item.created.toUTCString()}
          />
        )}
        showsVerticalScrollIndicator={false}
      />
      <SafeAreaView>
        <ChatInput chatId={chatId} />
      </SafeAreaView>
    </View>
  );
};

export default ChatRoomScreen;
