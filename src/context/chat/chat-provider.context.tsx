import React, {createContext, useEffect, useState} from 'react';
import {Socket} from 'socket.io-client';
import {
  connectUserChatAppSocket,
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
} from '../../app/store/state/chat-rooms-content/chat-room.actions';
import {handleChatSocketSaga} from '../../app/store/saga/chat-account-saga/chat-account.actions';
import {chatSocketSagaHandlers} from '../../app/store/saga/chat-account-saga/workers/constants';
import {IChatRoom} from '../../app/store/state/chat-rooms-content/chat-rooms-state.types';

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
  const {interlocutorId, email} = useReduxSelector(
    state => state.userChatAccountReducer,
  );
  const {token} = useReduxSelector(
    state => state.anonymousUserReducer.userAccountData,
  );
  const userChatRooms = useReduxSelector(state => state.chatRoomsSlice);
  const dispatch = useDispatch();

  useEffect(() => {
    if (!interlocutorId || !token) {
      return;
    }

    const newSocket = connectUserChatAppSocket({
      token,
    });

    newSocket.on(socketEventStatus.CONNECT, () => {
      console.info(strings.connectedChatServer);
    });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
      newSocket.removeAllListeners();
    };
  }, [interlocutorId, token]);

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

    console.info('Subscribing to chat room NOTIFICATION messages');
    socket.on(socketEventStatus.ROOM_NOTIFICATION_MESSAGE, handleChatMessage);
    socket.on(socketEventStatus.USER_CHAT_INVITATION, handleInvitation);

    return () => {
      socket.off(
        socketEventStatus.ROOM_NOTIFICATION_MESSAGE,
        handleChatMessage,
      );
      socket.off(socketEventStatus.USER_CHAT_INVITATION, handleInvitation);
    };
  }, [socket, currentActiveChatId, dispatch, email]);

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

  const handleJoinChat = async ({chatId}: {chatId: string}) => {
    try {
      if (!socket) {
        console.error(strings.socketIsNotConnected);
        return;
      }
      const currentRoom = userChatRooms[chatId];

      if (!currentRoom) {
        return;
      }

      const updatedRoom = (await joinChatRoomSocket(socket, {
        userChatIds: [chatId],
        interlocutorId,
      })) as IChatRoom;

      const roomData = {
        ...currentRoom,
        invitedUserIds: updatedRoom.invitedUserIds,
        usersData: updatedRoom.usersData,
      };

      dispatch(updateChatRoom(roomData));

      console.info(`${strings.joinedChatRoom} ${chatId}`);
    } catch (error) {
      console.error(strings.errorJoiningChatRoom, error);
      ErrorNotificationHandler({
        type: EPopupType.ERROR,
        text1: strings.errorJoiningChatRoom,
      });
    }
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
