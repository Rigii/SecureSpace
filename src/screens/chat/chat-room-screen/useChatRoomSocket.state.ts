import {useEffect, useState} from 'react';
import {useReduxSelector} from '../../../app/store/store';
import {IChatMessage} from '../../../app/store/state/chatRoomsContent/chatRoomsState.types';
import {connectUserChatNotificationsSocket} from '../../../services/sockets/chat/chat.socket';
import {strings} from '../../../context/chat/chat-provider.strings';
import {socketEventStatus} from '../../../context/chat/chat-provider.constants';
import {useDispatch} from 'react-redux';
import {addMessageToChatRoom} from '../../../app/store/state/chatRoomsContent/chatRoomsAction';
import {decryptMessage} from '../../../services/pgp-encryption-service/encrypt-decrypt-message';
import {
  EPopupType,
  ErrorNotificationHandler,
} from '../../../services/error-notification-handler';

interface IChatRoomSocketState {
  chatId: string;
}

export const useChatRoomSocketState = ({chatId}: IChatRoomSocketState) => {
  const [publicKeys, setPublicKeys] = useState<string[]>([]);
  const dispatch = useDispatch();

  const {interlocutorId, privateChatKey} = useReduxSelector(
    state => state.userChatAccountReducer,
  );

  useEffect(() => {
    const currentChatSocket = connectUserChatNotificationsSocket(
      interlocutorId,
      [chatId],
    );

    currentChatSocket.on(socketEventStatus.CONNECT, () => {
      console.log(`${strings.connectedChatWithId} ${chatId}`);
    });

    currentChatSocket.on(socketEventStatus.DISCONNECT, () => {
      console.log(`${strings.disconnectedChatWithId} ${chatId}`);
    });

    currentChatSocket.on(
      socketEventStatus.JOIN_CHAT_SUCCESS,
      ({message, data}: {message: string; data: string[]}) => {
        console.log(`${message}`);

        setPublicKeys(data);
      },
    );

    currentChatSocket.on(socketEventStatus.USER_LEFT_CHAT, () => {
      console.log(`${strings.disconnectedChatWithId} ${chatId}`);
    });

    currentChatSocket.on(
      socketEventStatus.CHAT_ROOM_MESSAGE,
      async (messageObject: {
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
        try {
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

          if (!privateChatKey) {
            throw new Error(strings.noPrivateChatKeyFound);
          }

          const decryptedMessage = await decryptMessage({
            privateKey: privateChatKey,
            passphrase: '',
            encryptedMessage: storeData.message,
          });

          dispatch(
            addMessageToChatRoom({...storeData, message: decryptedMessage}),
          );
        } catch (error) {
          const currentError = error as Error;
          ErrorNotificationHandler({
            text1: currentError.message || strings.messageDisplayError,
            type: EPopupType.ERROR,
          });
        }
      },
    );

    return () => {
      currentChatSocket.disconnect();
      currentChatSocket.removeAllListeners();
    };
  }, [chatId, interlocutorId, privateChatKey, dispatch]);

  return {publicKeys};
};
