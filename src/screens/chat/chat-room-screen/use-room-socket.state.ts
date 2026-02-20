import {useContext, useEffect, useState} from 'react';
import {useReduxSelector} from '../../../app/store/store';
import {strings} from '../../../context/chat/chat-provider.strings';
import {
  socketEventStatus,
  socketMessageNamespaces,
} from '../../../context/chat/chat-provider.constants';
import {useDispatch} from 'react-redux';

import {handleChatSocketSaga} from '../../../app/store/saga/chat-account-saga/chat-account.actions';
import {chatSocketSagaHandlers} from '../../../app/store/saga/chat-account-saga/workers/constants';
import {ChatSocketProviderContext} from '../../../context/chat/chat-provider.context';

interface IChatRoomSocketState {
  chatId: string;
}

export const useChatRoomSocketState = ({chatId}: IChatRoomSocketState) => {
  const {socket} = useContext(ChatSocketProviderContext);
  const [publicKeys, setPublicKeys] = useState<string[]>([]);
  const dispatch = useDispatch();

  const {interlocutorId, privateChatKey} = useReduxSelector(
    state => state.userChatAccountReducer,
  );

  useEffect(() => {
    if (!socket) {
      return;
    }
    const handleChatMessage = (message: any) => {
      console.log(22222, 'Received chat message:', message);
      dispatch(
        handleChatSocketSaga({
          type: chatSocketSagaHandlers.ROOM_MESSAGE_LIST_WORKER,
          data: {currentActiveChatId: chatId, message},
        }),
      );
    };

    socket.on(socketEventStatus.CONNECT, () => {
      console.info(`${strings.connectedChatWithId} ${chatId}`);
    });

    socket.on(socketEventStatus.DISCONNECT, () => {
      console.info(`${strings.disconnectedChatWithId} ${chatId}`);
    });

    socket.on(
      socketEventStatus.JOIN_CHAT_SUCCESS,
      ({message, data}: {message: string; data: string[]}) => {
        console.info(`${message}`);
        setPublicKeys(data);
      },
    );

    socket.on(socketEventStatus.USER_LEFT_CHAT, () => {
      console.info(`${strings.disconnectedChatWithId} ${chatId}`);
    });

    socket.on(socketEventStatus.CHAT_ROOM_MESSAGE, handleChatMessage);

    socket.emit(socketMessageNamespaces.JOIN_ROOM, {
      roomId: chatId,
      interlocutorId,
    });

    return () => {
      socket.emit(socketMessageNamespaces.LEAVE_ROOM, {
        roomId: chatId,
        interlocutorId,
      });

      socket.off(socketEventStatus.CONNECT);
      socket.off(socketEventStatus.DISCONNECT);
      socket.off(socketEventStatus.JOIN_CHAT_SUCCESS);
      socket.off(socketEventStatus.USER_LEFT_CHAT);
      socket.off(socketEventStatus.CHAT_ROOM_MESSAGE, handleChatMessage);
    };
  }, [chatId, interlocutorId, privateChatKey, dispatch, socket]);

  return {publicKeys};
};
