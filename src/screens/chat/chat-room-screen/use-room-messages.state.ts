import {useContext, useEffect, useRef} from 'react';
import {useReduxSelector} from '../../../app/store/store';
import {IChatMessage} from '../../../app/store/state/chat-rooms-content/chat-rooms-state.types';
import {strings} from '../../../context/chat/chat-provider.strings';
import {ChatSocketProviderContext} from '../../../context/chat/chat-provider.context';
import {useDispatch} from 'react-redux';
import {addMessagesToChatRoom} from '../../../app/store/state/chat-rooms-content/chat-room.actions';
import {getChatRoomMessages} from '../../../services/api/chat/chat-api';
import {NavigationProp, useNavigation} from '@react-navigation/native';
import {RootStackParamList} from '../../../app/navigator/screens';
import {FlatList} from 'react-native';
import {
  decryptMessage,
  isEncryptedMessage,
} from '../../../services/pgp-encryption-service/encrypt-decrypt-message';
import {
  EPopupType,
  ErrorNotificationHandler,
} from '../../../components/popup-message/error-notification-handler';

interface IChatRoomMessagesState {
  chatId: string;
}

export const useChatRoomMessagesState = ({chatId}: IChatRoomMessagesState) => {
  const flatListRef = useRef<FlatList>(null);

  const {setCurrentActiveChatId, leaveChatRoom, deleteChatRoom} = useContext(
    ChatSocketProviderContext,
  );
  const {token} = useReduxSelector(
    state => state.anonymousUserReducer.userAccountData,
  );

  const userChatRooms = useReduxSelector(state => state.chatRoomsSlice);
  const {interlocutorId, privateChatKey} = useReduxSelector(
    state => state.userChatAccountReducer,
  );
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const storedMessages = userChatRooms[chatId]?.messages || [];

  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  const dispatch = useDispatch();

  const isInvitationNotAccepted =
    userChatRooms[chatId]?.invitedUserIds?.includes(interlocutorId);

  useEffect(() => {
    if (!flatListRef.current || storedMessages.length < 1) {
      return;
    }

    flatListRef.current.scrollToEnd({animated: true});
  }, [storedMessages]);

  useEffect(() => {
    // TODO: moove flow to the saga

    const getMessages = async () => {
      try {
        const roomMessagesResponce = await getChatRoomMessages({
          roomId: chatId,
          pagination: {page: 1, limit: 200},
          token,
        });

        if (!roomMessagesResponce?.data || !roomMessagesResponce?.data.length) {
          return;
        }
        const responceMessages: IChatMessage[] = roomMessagesResponce?.data.map(
          (messageObject: {
            id: string;
            participantId: string;
            senderNickame: string;
            message: string;
            chatRoomId: string;
            isAdmin: boolean;
            mediaUrl?: string;
            voiceMessageUrl?: string;
            created: string;
            updated: string;
          }) => ({
            id: messageObject?.id,
            message: messageObject?.message,
            created: new Date(messageObject?.created).toLocaleString(),
            updated: new Date(messageObject?.updated).toLocaleString(),
            senderNickame: messageObject?.senderNickame,
            participantId: messageObject?.participantId,
            chatRoomId: messageObject?.chatRoomId,
            isAdmin: false,
            mediaUrl: messageObject?.mediaUrl,
            voiceMessageUrl: messageObject?.voiceMessageUrl,
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

        const decryptedMessages = await Promise.all(
          sortedMessages.map(async message => {
            if (!isEncryptedMessage(message.message)) {
              return message;
            }
            if (!privateChatKey) {
              throw new Error(strings.noPrivateChatKeyFound);
            }

            const decryptedMessage = await decryptMessage({
              privateKey: privateChatKey,
              passphrase: '',
              encryptedMessage: message.message,
            });

            return {
              ...message,
              message: decryptedMessage,
            };
          }),
        );
        dispatch(addMessagesToChatRoom(decryptedMessages));
      } catch (error) {
        const currentError = error as Error;
        console.error(currentError);
        ErrorNotificationHandler({
          text1: currentError.message || strings.messageDisplayError,
          type: EPopupType.ERROR,
        });
      }
    };
    getMessages();

    return () => {
      setCurrentActiveChatId(null);
    };
  }, [chatId, privateChatKey, token, dispatch, setCurrentActiveChatId]);

  const onLeaveChatRoom = async () => {
    try {
      await leaveChatRoom({chatRoomId: chatId});
      navigation.goBack();
    } catch (error) {
      console.info(strings.errorLeavingChatRoom);
    }
  };

  const onDeleteChatRoom = async () => {
    // TODO: add confirmation modal
    try {
      await deleteChatRoom({chatRoomId: chatId});
      navigation.goBack();
    } catch (error) {
      console.info(strings.errorDeletingChatRoom);
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
      action: onDeleteChatRoom,
    },
  ];
  return {
    messages: storedMessages,
    participantId: interlocutorId,
    chatRoomOptions,
    isInvitationNotAccepted,
    flatListRef,
  };
};
