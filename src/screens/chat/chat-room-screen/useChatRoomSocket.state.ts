import {useEffect, useState} from 'react';
import {useReduxSelector} from '../../../app/store/store';
import {IChatMessage} from '../../../app/store/state/chatRoomsContent/chatRoomsState.types';
import {connectUserChatNotificationsSocket} from '../../../services/sockets/chat/chat.socket';
import {strings} from '../../../services/context/chat/chat-provider.strings';
import {socketEvents} from '../../../services/context/chat/chat-context.constants';
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

    currentChatSocket.on(socketEvents.CONNECT, () => {
      console.log(`${strings.connectedChatWithId} ${chatId}`);
    });

    currentChatSocket.on(socketEvents.DISCONNECT, () => {
      console.log(`${strings.disconnectedChatWithId} ${chatId}`);
    });

    currentChatSocket.on(
      socketEvents.JOIN_CHAT_SUCCESS,
      ({message, data}: {message: string; data: string[]}) => {
        console.log(`${message}`);
        setPublicKeys(data);
      },
    );

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
  }, [chatId, interlocutorId, dispatch]);

  return {publicKeys};
};
