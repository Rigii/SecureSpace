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
import {getChatRoomsData} from '../../api/chat/chat-api';
import {useDispatch} from 'react-redux';
import {
  addNewChatRoom,
  deleteChatRoom,
  updateChatRoom,
} from '../../../app/store/state/chatRoomsContent/chatRoomsAction';
import {IFetchedChatRoom} from '../../../screens/login-signup/login-sign-up.types';

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
  const userChatRooms = useReduxSelector(state => state.chatRoomsReducer);
  const {token} = useReduxSelector(
    state => state.anonymousUserReducer.userAccountData,
  );

  const dispatch = useDispatch();

  useEffect(() => {
    if (!interlocutorId) return;
    const newSocket = connectUserChatNotificationsSocket(interlocutorId);

    newSocket.on(socketEvents.CONNECT, () => {
      console.log(strings.connectedChatServer);
    });

    newSocket.on(socketEvents.NEW_MESSAGE, (message: string) => {
      setMessages(prevMessages => [...prevMessages, message]);
    });

    newSocket.on(socketEvents.CHAT_ROOM_MESSAGE, (message: string) => {
      ErrorNotificationHandler({
        type: EPopupType.INFO,
        text1: `${strings.newMessageReceived} ${message}`,
      });
    });

    newSocket.on(socketEvents.USER_CHAT_INVITATION, async (message: any) => {
      console.log(strings.userChatInvitation, message);
      ErrorNotificationHandler({
        type: EPopupType.INFO,
        text1: `${strings.newRoomInvitation} ${message.chatName}`,
        text2: strings.findRoomInChatList,
      });

      // Get chat room data from the Socket message (no extra server call)
      const responce = await getChatRoomsData({
        token,
        roomIds: [message?.chatId],
      });
      if (!responce?.data) {
        return;
      }

      const chatData = responce.data[0] as IFetchedChatRoom;

      const chatRoomData = {
        id: chatData.id,
        password: '',
        chatName: chatData.chat_name,
        chatType: chatData.chat_type,
        ownerId: chatData.owner_id,
        moderatorIds: chatData.moderator_ids,
        usersData: chatData.users_data,
        invitedUserIds: chatData.invited_user_ids,
        messageDurationHours: chatData.message_duration_hours,
        chatMediaStorageUrl: chatData.chat_media_storage_url,
        chatIconUrl: chatData.chat_icon_url,
        availabilityAreaData: chatData.availability_area_data,
        messages: chatData.messages,
      };

      dispatch(addNewChatRoom(chatRoomData));
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
  }, [dispatch, interlocutorId, token]); // Reconnect when userIdChannel changes

  const handleCreateChat = (chatData: ICreateChatRoom) => {
    if (socket) {
      createChatRoomSocket(socket, chatData);
    } else {
      console.error(strings.socketIsNotConnected);
    }
  };

  const deleteRoomLocal = ({chatRoomId}: {chatRoomId: string}) => {
    dispatch(deleteChatRoom({chatRoomId}));
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

  const handleDeclineChatRoomInvitation = ({chatId}: {chatId: string}) => {
    declineChatRoomInvitationSocket(socket, {
      chatId,
      interlocutorId,
    });

    deleteRoomLocal({chatRoomId: chatId});
    ErrorNotificationHandler({
      type: EPopupType.INFO,
      text1: strings.chatInvitationDeclined,
    });
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
