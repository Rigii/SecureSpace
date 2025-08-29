import {useEffect, useState} from 'react';
import {useReduxSelector} from '../../../app/store/store';
import {IChatMessage} from '../../../app/store/state/chatRoomsContent/chatRoomsState.types';
import {connectUserChatNotificationsSocket} from '../../../services/sockets/chat/chat.socket';
import {strings} from '../../../services/context/chat/chat-provider.strings';
import {socketEventStatus} from '../../../services/context/chat/chat-context.constants';
import {useDispatch} from 'react-redux';
import {addMessageToChatRoom} from '../../../app/store/state/chatRoomsContent/chatRoomsAction';

interface IChatRoomSocketState {
  chatId: string;
}

export const useChatRoomSocketState = ({chatId}: IChatRoomSocketState) => {
  const [publicKeys, setPublicKeys] = useState<string[]>([]);
  const dispatch = useDispatch();

  const {interlocutorId} = useReduxSelector(
    state => state.userChatAccountReducer,
  );

  useEffect(() => {
    const currentChatSocket = connectUserChatNotificationsSocket(
      interlocutorId,
      [chatId],
    );

    // DEV //: Подписка на все события через перехватчик
    // currentChatSocket.onAny((event, ...args) => {
    //   console.log(77777, 'Получено событие:', event, args);
    // });

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
  }, [chatId, interlocutorId, dispatch]);

  return {publicKeys};
};
