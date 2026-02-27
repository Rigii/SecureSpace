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
  const [activeConnections, setActiveConnections] = useState<Set<string>>(
    new Set(),
  );
  const dispatch = useDispatch();

  const {interlocutorId, privateChatKey} = useReduxSelector(
    state => state.userChatAccountReducer,
  );

  useEffect(() => {
    if (!socket) {
      return;
    }
    const handleChatMessage = (message: any) => {
      dispatch(
        handleChatSocketSaga({
          type: chatSocketSagaHandlers.ROOM_MESSAGE_LIST_WORKER,
          data: {currentActiveChatId: chatId, message},
        }),
      );
    };

    socket.on(
      socketEventStatus.USER_JOINED_CHAT,
      ({
        data,
      }: {
        message: string;
        data: {
          interlocutorId: string;
          chatRoomId: string;
          activeConnections: string[];
        };
      }) => {
        console.info(`${strings.userJoinedChatWithId} ${data.interlocutorId}`);
        console.log(111111, 'JOINED', data.activeConnections);

        setActiveConnections(new Set(data.activeConnections));
      },
    );

    socket.on(
      socketEventStatus.USER_LEFT_CHAT,
      ({
        data,
      }: {
        message: string;
        data: {
          interlocutorId: string;
          chatRoomId: string;
          activeConnections: string[];
        };
      }) => {
        console.info(`${strings.userLeftChatWithId} ${data.interlocutorId}`);
        console.log(222222, 'LEFT', data.activeConnections);
        setActiveConnections(new Set(data.activeConnections));
      },
    );

    socket.on(
      socketEventStatus.JOIN_CHAT_SUCCESS,
      ({
        message,
        data,
      }: {
        message: string;
        data: {publicKeys: string[]; activeConnections: string[]};
      }) => {
        console.info(`${message}`);
        setPublicKeys(data.publicKeys);
        setActiveConnections(new Set(data.activeConnections));
      },
    );

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

      socket.off(socketEventStatus.JOIN_CHAT_SUCCESS);
      socket.off(socketEventStatus.USER_LEFT_CHAT);
      socket.off(socketEventStatus.CHAT_ROOM_MESSAGE, handleChatMessage);
    };
  }, [chatId, interlocutorId, privateChatKey, dispatch, socket]);
  console.log(7777777, 'CONNECTIONS', activeConnections);

  return {publicKeys, activeConnections};
};
