import React, {useCallback, useContext, useEffect} from 'react';
import {View, FlatList, SafeAreaView} from 'react-native';
import {useReduxSelector} from '../../../app/store/store';
import {IChatMessage} from '../../../app/store/state/chatRoomsContent/chatRoomsState.types';
import {connectUserChatNotificationsSocket} from '../../../services/sockets/chat/chat.socket';
import {strings} from '../../../services/context/chat/chat-provider.strings';
import {socketEvents} from '../../../services/context/chat/chat-context.constants';
import {ChatSocketProviderContext} from '../../../services/context/chat/chat-context-provider';
import {useDispatch} from 'react-redux';
import {
  addMessageToChatRoom,
  addMessagesToChatRoom,
} from '../../../app/store/state/chatRoomsContent/chatRoomsAction';
import {getChatRoomMessages} from '../../../services/api/chat/chat-api';
import ComponentsTopBar from '../../../components/top-bar/components-top-bar/components-top-bar';
import {NavigationProp, useNavigation} from '@react-navigation/native';
import {RootStackParamList} from '../../../app/navigator/screens';
import {ChatMessage} from '../../../components/chat-room-components/chat-message.component';
import ChatInput from '../../../components/chat-room-components/chat-input.component';

interface IChatRoomScreen {
  chatId: string;
}

const ChatRoomScreen: React.FC<IChatRoomScreen> = ({chatId}) => {
  const {setCurrentActiveChatId, leaveRoomLocal} = useContext(
    ChatSocketProviderContext,
  );
  const {token} = useReduxSelector(
    state => state.anonymousUserReducer.userAccountData,
  );
  const {interlocutorId} = useReduxSelector(
    state => state.userChatAccountReducer,
  );
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  const dispatch = useDispatch();

  const getMessages = useCallback(async () => {
    try {
      const roomMessagesResponce = await getChatRoomMessages({
        roomId: chatId,
        pagination: {page: 1, limit: 20},
        token,
      });

      const messages = roomMessagesResponce?.data.map(
        (messageObject: {
          id: string;
          participantId: string;
          senderNikName: string;
          message: string;
          chatRoomId: string;
          isAdmin: boolean;
          mediaUrl?: string;
          voiceMessageUrl?: string;
          created: string;
          updated: string;
        }) => ({
          id: messageObject.id,
          message: messageObject.message,
          created: new Date(messageObject.created).toLocaleString(),
          updated: new Date(messageObject.updated).toLocaleString(),
          senderNikName: messageObject.senderNikName,
          participantId: messageObject.participantId,
          chatRoomId: messageObject.chatRoomId,
          isAdmin: false,
          mediaUrl: messageObject.mediaUrl,
          voiceMessageUrl: messageObject.voiceMessageUrl,
        }),
      );

      dispatch(addMessagesToChatRoom(messages));
    } catch (error) {
      console.log(strings.errorFetchingMessages, error);
    }
  }, [chatId, token, dispatch]);

  useEffect(() => {
    getMessages();

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
      (messageObject: {
        id: string;
        participantId: string;
        senderNikName: string;
        message: string;
        chatRoomId: string;
        isAdmin: boolean;
        mediaUrl?: string;
        voiceMessageUrl?: string;
        created: string;
        updated: string;
      }) => {
        const storeData: IChatMessage = {
          id: messageObject.id,
          message: messageObject.message,
          created: new Date(messageObject.created).toLocaleString(),
          updated: new Date(messageObject.updated).toLocaleString(),
          senderNikName: messageObject.senderNikName,
          participantId: messageObject.participantId,
          chatRoomId: messageObject.chatRoomId,
          isAdmin: false,
          mediaUrl: messageObject.mediaUrl,
          voiceMessageUrl: messageObject.voiceMessageUrl,
        };

        dispatch(addMessageToChatRoom(storeData));
      },
    );

    return () => {
      currentChatSocket.disconnect();
      currentChatSocket.removeAllListeners();
    };
  }, [
    chatId,
    interlocutorId,
    token,
    setCurrentActiveChatId,
    dispatch,
    getMessages,
  ]);

  const userChatRooms = useReduxSelector(state => state.chatRoomsReducer);
  const participantId = useReduxSelector(
    state => state.userChatAccountReducer.interlocutorId,
  );

  const {messages} = userChatRooms[chatId];
  const sortedByDateMessages = messages?.sort(
    (a: IChatMessage, b: IChatMessage) =>
      new Date(b.created).getTime() - new Date(a.created).getTime(),
  );

  const leaveChatRoom = async () => {
    try {
      await leaveRoomLocal({chatRoomId: chatId});
      navigation.goBack();
    } catch (error) {
      console.log(strings.errorLeavingChatRoom);
    }
  };

  const chatRoomOptions = [
    {
      id: 'roomInfo',
      label: 'Room Info',
      icon: '',
      action: () => null,
    },
    {
      id: 'roomSearch',
      label: 'Search',
      icon: '',
      action: () => null,
    },
    {
      id: 'roomMute',
      label: 'Mute',
      icon: '',
      action: () => null,
    },
    {
      id: 'roomLeave',
      label: 'Leave',
      icon: '',
      action: leaveChatRoom,
    },
    {
      id: 'roomReport',
      label: 'Report',
      icon: '',
      action: () => null,
    },
    {
      id: 'roomDelete',
      label: 'Delete',
      icon: '',
      action: () => null,
    },
  ];

  return (
    <View className="flex-1">
      <ComponentsTopBar settingsData={chatRoomOptions} />

      <FlatList
        data={sortedByDateMessages}
        keyExtractor={item => item.id}
        renderItem={({item}) => (
          <ChatMessage
            message={item.message}
            isOwnMessage={item.participantId === participantId}
            senderName={item.senderNikName}
            time={item.created}
          />
        )}
        showsVerticalScrollIndicator={false}
      />
      <SafeAreaView>
        <ChatInput
          chatId={chatId}
          inputPlaceholder={strings.enterYourMessage}
        />
      </SafeAreaView>
    </View>
  );
};

export default ChatRoomScreen;
