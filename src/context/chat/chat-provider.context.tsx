import React, {createContext, useEffect, useState} from 'react';
import {Socket} from 'socket.io-client';
import {
  connectUserChatNotificationsSocket,
  createChatRoomSocket,
  declineChatRoomInvitationSocket,
  deleteChatRoomSocket,
  joinChatRoomSocket,
  leaveChatRoomSocket,
  sendChatRoomMessage,
} from '../../services/sockets/chat/chat.socket';
import {ICreateChatRoom} from '../../services/sockets/chat/chat-api.types';
import {useReduxSelector} from '../../app/store/store';
import {strings} from './chat-provider.strings';
import {socketEventStatus} from './chat-provider.constants';
import {
  EPopupType,
  ErrorNotificationHandler,
} from '../../components/popup-message/error-notification-handler';
import {useDispatch} from 'react-redux';
import {
  addNewChatRoom,
  deleteChatRoomLocalData,
  updateChatRoom,
} from '../../app/store/state/chatRoomsContent/chatRoomsAction';
import {handleChatSocketSaga} from '../../app/store/saga/chat-account-saga/chat-account.actions';
import {chatSocketSagaHandlers} from '../../app/store/saga/chat-account-saga/workers/constants';

export const ChatSocketProviderContext = createContext<{
  socket: Socket | null;
  handleCreateChat: (chatData: ICreateChatRoom) => void;
  handleJoinChat: ({chatId}: {chatId: string}) => void;
  handleDeclineChatRoomInvitation: ({chatId}: {chatId: string}) => void;
  setCurrentActiveChatId: React.Dispatch<React.SetStateAction<string | null>>;
  handleSendChatRoomMessage: ({
    message,
    chatRoomId,
  }: {
    message: string;
    chatRoomId: string;
  }) => void;
  leaveChatRoom: ({chatRoomId}: {chatRoomId: string}) => void;
  deleteChatRoom: ({chatRoomId}: {chatRoomId: string}) => void;
}>({
  socket: null,
  handleCreateChat: () => {},
  handleJoinChat: () => {},
  handleDeclineChatRoomInvitation: () => {},
  handleSendChatRoomMessage: () => {},
  setCurrentActiveChatId: () => {},
  leaveChatRoom: () => {},
  deleteChatRoom: () => {},
});

export const ChatSocketProvider: React.FC<{children: React.ReactNode}> = ({
  children,
}) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [currentActiveChatId, setCurrentActiveChatId] = useState<string | null>(
    null,
  );
  console.log();
  const {interlocutorId, email} = useReduxSelector(
    state => state.userChatAccountReducer,
  );
  const userChatRooms = useReduxSelector(state => state.chatRoomsSlice);

  const dispatch = useDispatch();

  useEffect(() => {
    if (!interlocutorId) {
      return;
    }

    const newSocket = connectUserChatNotificationsSocket(interlocutorId);

    newSocket.on(socketEventStatus.CONNECT, () => {
      console.log(strings.connectedChatServer);
    });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
      newSocket.removeAllListeners();
    };
  }, [interlocutorId]);

  useEffect(() => {
    if (!socket) {
      return;
    }

    const handleChatMessage = (message: any) => {
      dispatch(
        handleChatSocketSaga({
          type: chatSocketSagaHandlers.ROOM_MESSAGE_NOTIFICATION_WORKER,
          data: {currentActiveChatId, message},
        }),
      );
    };

    const handleInvitation = (message: any) => {
      dispatch(
        handleChatSocketSaga({
          type: chatSocketSagaHandlers.USER_CHAT_INVITATION_WORKER,
          data: {currentActiveChatId, message},
        }),
      );
    };

    if (!currentActiveChatId || currentActiveChatId === null) {
      console.log('Subscribing to chat room NOTIFICATION messages');
      socket.on(socketEventStatus.CHAT_ROOM_MESSAGE, handleChatMessage);
    } else {
      console.log('Unsubscribing from chat room NOTIFICATION messages');
      socket.off(socketEventStatus.CHAT_ROOM_MESSAGE, handleChatMessage);
    }
    socket.on(socketEventStatus.USER_CHAT_INVITATION, handleInvitation);

    return () => {
      socket.off(socketEventStatus.CHAT_ROOM_MESSAGE, handleChatMessage);
      socket.off(socketEventStatus.USER_CHAT_INVITATION, handleInvitation);
    };
  }, [socket, currentActiveChatId, dispatch]);

  const handleCreateChat = async (chatData: ICreateChatRoom) => {
    if (!socket) {
      console.error(strings.socketIsNotConnected);
      return;
    }
    const room = await createChatRoomSocket(socket, chatData);

    if (!room) {
      return;
    }
    dispatch(addNewChatRoom(room));
  };

  const leaveRoomLocal = ({chatRoomId}: {chatRoomId: string}) => {
    dispatch(deleteChatRoomLocalData({chatRoomId}));
  };

  const deleteChatRoom = ({chatRoomId}: {chatRoomId: string}) => {
    const chatRoom = userChatRooms[chatRoomId];
    if (!chatRoom) {
      console.error(strings.chatRoomNotFound);
      return;
    }
    if (!socket) {
      console.error(strings.socketIsNotConnected);
      return;
    }

    deleteChatRoomSocket(socket, {
      roomId: chatRoomId,
      interlocutorId,
    });
    leaveRoomLocal({chatRoomId});
  };

  const leaveChatRoom = ({chatRoomId}: {chatRoomId: string}) => {
    if (!socket) {
      console.error(strings.socketIsNotConnected);
      return;
    }
    const chatData = {chatId: chatRoomId, interlocutorId};
    leaveChatRoomSocket(socket, chatData);
    leaveRoomLocal({chatRoomId});
    setCurrentActiveChatId(null);
  };

  const handleJoinChat = ({chatId}: {chatId: string}) => {
    const currentRoom = userChatRooms[chatId];

    if (!currentRoom) {
      return;
    }

    joinChatRoomSocket(socket, {
      userChatIds: [chatId],
      interlocutorId,
    });

    dispatch(
      updateChatRoom({
        ...currentRoom,
        invitedUserIds: currentRoom.invitedUserIds.filter(
          id => id !== interlocutorId,
        ),
      }),
    );

    console.log(`${strings.joinedChatRoom} ${chatId}`);
  };

  const handleSendChatRoomMessage = ({
    message,
    chatRoomId,
  }: {
    message: string;
    chatRoomId: string;
  }) => {
    const messageData = {
      chatRoomId,
      chatRoomName: userChatRooms[chatRoomId]?.chatName || '',
      message,
      senderId: interlocutorId,
      senderName: email,
    };

    sendChatRoomMessage(socket, messageData);
  };

  const handleDeclineChatRoomInvitation = ({chatId}: {chatId: string}) => {
    declineChatRoomInvitationSocket(socket, {
      chatId,
      interlocutorId,
    });

    leaveRoomLocal({chatRoomId: chatId});
    ErrorNotificationHandler({
      type: EPopupType.INFO,
      text1: strings.chatInvitationDeclined,
    });
  };

  return (
    <ChatSocketProviderContext.Provider
      value={{
        socket,
        deleteChatRoom,
        leaveChatRoom,
        setCurrentActiveChatId,
        handleCreateChat,
        handleJoinChat,
        handleDeclineChatRoomInvitation,
        handleSendChatRoomMessage,
      }}>
      {children}
    </ChatSocketProviderContext.Provider>
  );
};
