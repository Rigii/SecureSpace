import {useContext, useEffect, useRef} from 'react';
import {useReduxSelector} from '../../../app/store/store';
import {IChatMessage} from '../../../app/store/state/chatRoomsContent/chatRoomsState.types';
import {strings} from '../../../services/context/chat/chat-provider.strings';
import {ChatSocketProviderContext} from '../../../services/context/chat/chat-context-provider';
import {useDispatch} from 'react-redux';
import {addMessagesToChatRoom} from '../../../app/store/state/chatRoomsContent/chatRoomsAction';
import {getChatRoomMessages} from '../../../services/api/chat/chat-api';
import {NavigationProp, useNavigation} from '@react-navigation/native';
import {RootStackParamList} from '../../../app/navigator/screens';
import {FlatList} from 'react-native';

interface IChatRoomMessagesState {
  chatId: string;
}

export const useChatRoomMessagesState = ({chatId}: IChatRoomMessagesState) => {
  const flatListRef = useRef<FlatList>(null);

  const {setCurrentActiveChatId, leaveChatRoom} = useContext(
    ChatSocketProviderContext,
  );
  const {token} = useReduxSelector(
    state => state.anonymousUserReducer.userAccountData,
  );

  const userChatRooms = useReduxSelector(state => state.chatRoomsReducer);
  const participantId = useReduxSelector(
    state => state.userChatAccountReducer.interlocutorId,
  );
  const {messages} = userChatRooms[chatId] || {messages: []};

  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  const dispatch = useDispatch();

  useEffect(() => {
    if (!flatListRef.current || messages.length < 1) {
      return;
    }

    flatListRef.current.scrollToEnd({animated: true});
  }, [messages]);

  useEffect(() => {
    setCurrentActiveChatId(chatId);
    const getMessages = async () => {
      try {
        const roomMessagesResponce = await getChatRoomMessages({
          roomId: chatId,
          pagination: {page: 1, limit: 200},
          token,
        });

        const responceMessages: IChatMessage[] = roomMessagesResponce?.data.map(
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

        const sortMessages = (thisMessages: IChatMessage[]) => {
          if (!thisMessages) {
            return [];
          }

          const sortedMessages = thisMessages.sort(
            (a: IChatMessage, b: IChatMessage) =>
              new Date(b.created).getTime() - new Date(a.created).getTime(),
          );
          return sortedMessages;
        };

        const sortedMessages = sortMessages(responceMessages);
        dispatch(addMessagesToChatRoom(sortedMessages));

        return () => {
          setCurrentActiveChatId(null);
        };
      } catch (error) {
        console.log(strings.errorFetchingMessages, error);
      }
    };
    getMessages();
  }, [chatId, dispatch, setCurrentActiveChatId, token]);

  const onLeaveChatRoom = async () => {
    try {
      await leaveChatRoom({chatRoomId: chatId});
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
      action: onLeaveChatRoom,
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

  return {
    messages,
    participantId,
    chatRoomOptions,
    flatListRef,
  };
};
