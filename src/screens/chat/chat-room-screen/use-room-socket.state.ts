import {useEffect, useState} from 'react';
import {useReduxSelector} from '../../../app/store/store';
import {connectUserChatNotificationsSocket} from '../../../services/sockets/chat/chat.socket';
import {strings} from '../../../context/chat/chat-provider.strings';
import {socketEventStatus} from '../../../context/chat/chat-provider.constants';
import {useDispatch} from 'react-redux';

import {handleChatSocketSaga} from '../../../app/store/saga/chat-account-saga/chat-account.actions';
import {chatSocketSagaHandlers} from '../../../app/store/saga/chat-account-saga/workers/constants';

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
      chatId,
    );

    const handleChatMessage = (message: any) => {
      dispatch(
        handleChatSocketSaga({
          type: chatSocketSagaHandlers.ROOM_MESSAGE_LIST_WORKER,
          data: {currentActiveChatId: chatId, message},
        }),
      );
    };

    currentChatSocket.on(socketEventStatus.CONNECT, () => {
      console.info(`${strings.connectedChatWithId} ${chatId}`);
    });

    currentChatSocket.on(socketEventStatus.DISCONNECT, () => {
      console.info(`${strings.disconnectedChatWithId} ${chatId}`);
    });

    currentChatSocket.on(
      socketEventStatus.JOIN_CHAT_SUCCESS,
      ({message, data}: {message: string; data: string[]}) => {
        console.info(`${message}`);

        setPublicKeys(data);
      },
    );

    currentChatSocket.on(socketEventStatus.USER_LEFT_CHAT, () => {
      console.info(`${strings.disconnectedChatWithId} ${chatId}`);
    });

    currentChatSocket.on(
      socketEventStatus.CHAT_ROOM_MESSAGE,
      handleChatMessage,
    );

    return () => {
      currentChatSocket.off(
        socketEventStatus.CHAT_ROOM_MESSAGE,
        handleChatMessage,
      );
      currentChatSocket.disconnect();
    };
  }, [chatId, interlocutorId, privateChatKey, dispatch]);

  return {publicKeys};
};
