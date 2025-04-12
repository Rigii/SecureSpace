import React, {createContext, useEffect, useState} from 'react';
import {Socket} from 'socket.io-client';
import {
  connectUserChatNotificationsSocket,
  createChatRoomSocket,
  declineChatRoomInvitationSocket,
  joinChatRoomSocket,
} from '../../sockets/chat/chat.socket';
import {ICreateChatRoom} from '../../sockets/chat/chat-api.types';
import {useReduxSelector} from '../../../app/store/store';
import {strings} from './chat-provider.strings';
import {socketEvents} from './chat-context.constants';
import {
  EPopupType,
  ErrorNotificationHandler,
} from '../../ErrorNotificationHandler';

export const ChatSocketProviderContext = createContext<{
  socket: Socket | null;
  messages: string[];
  handleCreateChat: (chatData: ICreateChatRoom) => void;
  handleJoinChat: ({chatId}: {chatId: string}) => void;
  handleDeclineChatRoomInvitation: ({chatId}: {chatId: string}) => void;
}>({
  socket: null,
  messages: [],
  handleCreateChat: () => {},
  handleJoinChat: () => {},
  handleDeclineChatRoomInvitation: () => {},
});

export const ChatSocketProvider: React.FC<{children: React.ReactNode}> = ({
  children,
}) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [messages, setMessages] = useState<string[]>([]);

  const {interlocutorId} = useReduxSelector(
    state => state.userChatAccountReducer,
  );
  useEffect(() => {
    if (!interlocutorId) return;
    const newSocket = connectUserChatNotificationsSocket(interlocutorId);

    newSocket.on(socketEvents.CONNECT, () => {
      console.log(strings.connectedChatServer);
    });

    newSocket.on(socketEvents.NEW_MESSAGE, (message: string) => {
      console.log(strings.newMessageReceived, message);
      setMessages(prevMessages => [...prevMessages, message]);
    });

    newSocket.on(socketEvents.USER_CHAT_INVITATION, (message: any) => {
      console.log(strings.userChatInvitation, message);
      ErrorNotificationHandler({
        type: EPopupType.INFO,
        text1: `${strings.newRoomInvitation} ${message.chatName}`,
        text2: strings.findRoomInChatList,
      });
    });

    newSocket.on(socketEvents.DISCONNECT, () => {
      console.log(strings.disconnectedChatServer);
    });

    newSocket.on(socketEvents.ERROR, (error: any) => {
      console.error(strings.socketError, error);
    });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
      newSocket.removeAllListeners();
    };
  }, [interlocutorId]); // Reconnect when userIdChannel changes

  const handleCreateChat = (chatData: ICreateChatRoom) => {
    if (socket) {
      createChatRoomSocket(socket, chatData);
    } else {
      console.error(strings.socketIsNotConnected);
    }
  };

  const updateUserChatDataLocal = () => {
    // removeInterlocutorIdFromChatInvitationArray(chatId);
  };

  const handleJoinChat = ({chatId}: {chatId: string}) => {
    joinChatRoomSocket(
      socket,
      {
        chatId,
        interlocutorId,
      },
      updateUserChatDataLocal,
    );

    console.log(`${strings.joinedChatRoom} ${chatId}`);
  };

  const handleDeclineChatRoomInvitation = ({chatId}: {chatId: string}) => {
    declineChatRoomInvitationSocket(
      socket,
      {
        chatId,
        interlocutorId,
      },
      updateUserChatDataLocal,
    );
  };

  return (
    <ChatSocketProviderContext.Provider
      value={{
        socket,
        messages,
        handleCreateChat,
        handleJoinChat,
        handleDeclineChatRoomInvitation,
      }}>
      {children}
    </ChatSocketProviderContext.Provider>
  );
};
