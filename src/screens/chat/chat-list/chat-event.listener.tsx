import {useEffect} from 'react';
import {useReduxSelector} from '../../../app/store/store';
import {useDispatch} from 'react-redux';
import {strings} from '../chat.strings';
import {
  EPopupType,
  ErrorNotificationHandler,
} from '../../../services/ErrorNotificationHandler';
import {
  chatEvents,
  listernUserChatNotifications,
  socketMessageNamespaces,
} from '../../../services/sockets/chat/chat.socket';

export const ChatSocketEventListener = () => {
  const dispatch = useDispatch();
  const {id} = useReduxSelector(
    state => state.anonymousUserReducer.userAccountData,
  );
  const {accountId, interlocutorId} = useReduxSelector(
    state => state.userChatAccountReducer,
  );

  const chatUserSocketListener = listernUserChatNotifications(interlocutorId);

  const onCreateChatRoom = () => {
    chatUserSocketListener.emit(
      socketMessageNamespaces.CREATE_CHAT,
      {ownerId: id},
      (response: any) => {
        if (response?.error) {
          ErrorNotificationHandler({
            type: EPopupType.ERROR,
            text1: strings.creatingChatRoomError,
            text2: response.error,
          });
        } else {
          ErrorNotificationHandler({
            type: EPopupType.SUCCESS,
            text1: strings.chatRoomCreated,
          });
        }
      },
    );
  };

  useEffect(() => {
    if (!interlocutorId) return;

    chatUserSocketListener.on(chatEvents.USER_CHAT_INVITATION, chatData => {
      ErrorNotificationHandler({
        type: EPopupType.INFO,
        text1: strings.newChatInvitation,
        text2: chatData.text || '',
      });
      // dispatch(addInvitation(chatData));
    });

    chatUserSocketListener.on(chatEvents.USER_CHAT_JOIN, chatData => {
      console.log('User added to chat:', chatData);
      ErrorNotificationHandler({
        type: EPopupType.SUCCESS,
        text1: strings.youAddedToChat,
        text2: chatData.text || '',
      });
      // dispatch(addChatRoom(chatData));
    });

    chatUserSocketListener.on(chatEvents.CREATE_CHAT_SUCCESS, chatData => {
      ErrorNotificationHandler({
        type: EPopupType.SUCCESS,
        text1: strings.chatRoomCreated,
        text2: chatData.text || '',
      });
      // dispatch(addChatRoom(chatData));
    });

    chatUserSocketListener.on(chatEvents.CREATE_CHAT_ERROR, chatData => {
      ErrorNotificationHandler({
        type: EPopupType.ERROR,
        text1: strings.failChatCreation,
        text2: chatData.text || '',
      });
    });

    return () => {
      chatUserSocketListener.off(chatEvents.USER_CHAT_INVITATION);
      chatUserSocketListener.off(chatEvents.USER_CHAT_JOIN);
      chatUserSocketListener.off(chatEvents.CREATE_CHAT_SUCCESS);
      chatUserSocketListener.off(chatEvents.CREATE_CHAT_ERROR);
    };
  }, [interlocutorId, chatUserSocketListener, dispatch]);

  return {accountId, onCreateChatRoom};
};
