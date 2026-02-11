import {select, call, put} from 'redux-saga/effects';
import {getChatRoomsData} from '../../../../../services/api/chat/chat-api';
import {
  addMessageToChatRoom,
  addNewChatRoom,
} from '../../../state/chatRoomsContent/chatRoomsAction';
import {
  EPopupType,
  ErrorNotificationHandler,
} from '../../../../../components/popup-message/error-notification-handler';
import {IFetchedChatRoom} from '../../../../../screens/login-signup/login-sign-up.types';
import {IChatMessage} from '../../../state/chatRoomsContent/chatRoomsState.types';
import {decryptMessage} from '../../../../../services/pgp-encryption-service/encrypt-decrypt-message';
import {chatSocketSagaHandlers} from './constants';
import {IChatSocketEvent, IChatSocketMessageType} from '../types';

export type TChatSocketEventType = keyof typeof chatSocketSagaHandlers;

const strings = {
  room: 'Room:',
  newMessageFrom: 'New message from:',
  messageDisplayError: 'Error displaying the message',
  noPrivateChatKeyFound: 'No private chat key found',
};

function* handleInvitationSaga(message: {
  chatId: string;
  chatName: string;
  message: string;
}): Generator<any, void, any> {
  const {token} = yield select(
    thisState => thisState.anonymousUserReducer.userAccountData,
  );
  const response = yield call(getChatRoomsData, {
    token,
    roomIds: [message.chatId],
  });

  const chatData = response.data[0] as IFetchedChatRoom;

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

  yield put(addNewChatRoom(chatRoomData));

  ErrorNotificationHandler({
    type: EPopupType.INFO,
    text1: `New room invitation: ${message.chatName}`,
  });
}

function* handleRoomMessageListSaga({
  messageObject,
}: {
  messageObject: IChatMessage;
}): Generator<any, void, any> {
  try {
    const {privateChatKey} = yield select(
      thisState => thisState.userChatAccountReducer,
    );

    const storeData: IChatMessage = {
      id: messageObject.id,
      message: messageObject.message,
      created: new Date(messageObject.created).toLocaleString(),
      updated: new Date(messageObject.updated).toLocaleString(),
      senderNickame: messageObject.senderNickame,
      participantId: messageObject.participantId,
      chatRoomId: messageObject.chatRoomId,
      isAdmin: messageObject.isAdmin || false,
      mediaUrl: messageObject.mediaUrl,
      voiceMessageUrl: messageObject.voiceMessageUrl,
    };

    if (!privateChatKey) {
      throw new Error(strings.noPrivateChatKeyFound);
    }

    const decryptedMessage = yield call(decryptMessage, {
      privateKey: privateChatKey,
      passphrase: '',
      encryptedMessage: storeData.message,
    });

    yield put(addMessageToChatRoom({...storeData, message: decryptedMessage}));
  } catch (error) {
    const currentError = error as Error;
    ErrorNotificationHandler({
      text1: currentError.message || strings.messageDisplayError,
      type: EPopupType.ERROR,
    });
  }
}

function* handleRoomMessageNotificationSaga({
  message,
}: {
  message: IChatMessage;
}): Generator<any, void, any> {
  ErrorNotificationHandler({
    type: EPopupType.INFO,
    text1: `${strings.room} ${message.chatRoomName}`,
    text2: `${strings.newMessageFrom} ${message.senderNickame}`,
  });
}

export function* handleSocketEventWorker(action: {
  payload: IChatSocketEvent;
}): Generator<any, void, any> {
  const {type, data} = action.payload;

  const {message} = data;
  switch (type) {
    case chatSocketSagaHandlers.USER_CHAT_INVITATION_WORKER:
      yield call(
        handleInvitationSaga,
        message as IChatSocketMessageType[typeof chatSocketSagaHandlers.USER_CHAT_INVITATION_WORKER],
      );
      break;

    case chatSocketSagaHandlers.ROOM_MESSAGE_NOTIFICATION_WORKER:
      yield call(handleRoomMessageNotificationSaga, {
        message:
          message as IChatSocketMessageType[typeof chatSocketSagaHandlers.ROOM_MESSAGE_NOTIFICATION_WORKER],
      });
      break;

    case chatSocketSagaHandlers.ROOM_MESSAGE_LIST_WORKER:
      yield call(handleRoomMessageListSaga, {
        messageObject:
          message as IChatSocketMessageType[typeof chatSocketSagaHandlers.ROOM_MESSAGE_LIST_WORKER],
      });
      break;
  }
}
