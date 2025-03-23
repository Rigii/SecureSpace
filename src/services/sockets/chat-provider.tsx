import React, {createContext, useEffect, useState} from 'react';
import {Socket} from 'socket.io-client';
import {
  connectUserChatNotificationsSocket,
  createChatRoom,
} from './chat.socket';
import {ICreateChatRoom} from './chat-api.types';

// Create the context
export const ChatSocketProviderContext = createContext<{
  socket: Socket | null;
  messages: string[];
  setUserIdChannel: (userId: string) => void;
  handleCreateChat: (chatData: ICreateChatRoom) => void;
  handleJoinChat: (chatId: string) => void;
}>({
  socket: null,
  messages: [],
  setUserIdChannel: () => {},
  handleCreateChat: () => {},
  handleJoinChat: () => {},
});

export const ChatSocketProvider: React.FC<{children: React.ReactNode}> = ({
  children,
}) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [messages, setMessages] = useState<string[]>([]);
  const [userIdChannel, setUserIdChannel] = useState<string>('');

  useEffect(() => {
    if (!userIdChannel) return;

    const newSocket = connectUserChatNotificationsSocket(userIdChannel);

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
  }, [userIdChannel]); // Reconnect when userIdChannel changes

  const handleCreateChat = (chatData: ICreateChatRoom) => {
    if (socket) {
      createChatRoom(socket, chatData);
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
        setUserIdChannel,
        handleCreateChat,
        handleJoinChat,
      }}>
      {children}
    </ChatSocketProviderContext.Provider>
  );
};
