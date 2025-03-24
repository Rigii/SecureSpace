import React, {createContext, useEffect, useState} from 'react';
import {Socket} from 'socket.io-client';
import {
  connectUserChatNotificationsSocket,
  createChatRoom,
} from '../../sockets/chat/chat.socket';
import {ICreateChatRoom} from '../../sockets/chat/chat-api.types';
import {useReduxSelector} from '../../../app/store/store';

// Create the context
export const ChatSocketProviderContext = createContext<{
  socket: Socket | null;
  messages: string[];
  handleCreateChat: (chatData: ICreateChatRoom) => void;
  handleJoinChat: (chatId: string) => void;
}>({
  socket: null,
  messages: [],
  handleCreateChat: () => {},
  handleJoinChat: () => {},
});

export const ChatSocketProvider: React.FC<{children: React.ReactNode}> = ({
  children,
}) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [messages, setMessages] = useState<string[]>([]);

  const {interlocutorId} = useReduxSelector(state => state.userChatsReducer);

  useEffect(() => {
    if (!interlocutorId) return;
    console.log(111111, interlocutorId);

    const newSocket = connectUserChatNotificationsSocket(interlocutorId);
    console.log(2222222, newSocket);

    newSocket.on('connect', () => {
      console.log('Connected to the chat server');
    });

    newSocket.on('newMessage', (message: string) => {
      console.log('New message received:', message);
      setMessages(prevMessages => [...prevMessages, message]);
    });

    newSocket.on('disconnect', () => {
      console.log('Disconnected from the chat server');
    });

    newSocket.on('error', (error: any) => {
      console.error('Socket error:', error);
    });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
      newSocket.removeAllListeners();
    };
  }, [interlocutorId]); // Reconnect when userIdChannel changes

  const handleCreateChat = (chatData: ICreateChatRoom) => {
    if (socket) {
      const room = createChatRoom(socket, chatData);
      console.log(555555, room);
    } else {
      console.error('Socket is not connected');
    }
  };

  const handleJoinChat = (chatId: string) => {
    if (socket) {
      socket.emit('join_chat', chatId);
      // setCurrentChatId(chatId);
      console.log(`Joined chat room: ${chatId}`);
    }
  };

  return (
    <ChatSocketProviderContext.Provider
      value={{
        socket,
        messages,
        handleCreateChat,
        handleJoinChat,
      }}>
      {children}
    </ChatSocketProviderContext.Provider>
  );
};
