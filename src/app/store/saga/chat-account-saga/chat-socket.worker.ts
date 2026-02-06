import {select, call, put} from 'redux-saga/effects';
import {getChatRoomsData} from '../../../../services/api/chat/chat-api';
import {addNewChatRoom} from '../../state/chatRoomsContent/chatRoomsAction';
import {
  EPopupType,
  ErrorNotificationHandler,
} from '../../../../services/error-notification-handler';
import {IFetchedChatRoom} from '../../../../screens/login-signup/login-sign-up.types';

export const chatSocketSagaHandlers = {
  USER_CHAT_INVITATION: 'USER_CHAT_INVITATION',
  CHAT_ROOM_MESSAGE: 'CHAT_ROOM_MESSAGE',
} as const;

export type TChatSocketEventType = keyof typeof chatSocketSagaHandlers;

const strings = {
  newMessageReceived: 'New message received:',
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

function* handleNewMessageSaga({
  currentActiveChatId,
  message,
}: {
  currentActiveChatId: string;
  message: {chatId: string; chatName: string; message: string};
}): Generator<any, void, any> {
  if (currentActiveChatId === message.chatId) {
    return;
  }
  ErrorNotificationHandler({
    type: EPopupType.INFO,
    text1: `${strings.newMessageReceived} ${message.message}`,
  });
}

export function* handleSocketEventWorker(
  action: any,
): Generator<any, void, any> {
  const {type, data} = action.payload;

  const {currentActiveChatId, message} = data;

  switch (type) {
    case chatSocketSagaHandlers.USER_CHAT_INVITATION:
      yield call(handleInvitationSaga, message);
      break;

    case chatSocketSagaHandlers.CHAT_ROOM_MESSAGE:
      yield call(handleNewMessageSaga, {currentActiveChatId, message});
      break;
  }
}
