import {call, put, select} from 'redux-saga/effects';
import {
  deleteChatRoomSocket,
  leaveChatRoomSocket,
} from '../../../../../services/sockets/chat/chat.socket';
import {deleteChatRoomLocalData} from '../../../state/chat-rooms-content/chat-room.actions';
import {leaveChatRoomSaga} from '../chat-account.actions';

export function* leaveChatRoomWorker(
  action: ReturnType<typeof leaveChatRoomSaga>,
): Generator<any, void, any> {
  const {socket, chatRoomId} = action.payload;

  const {interlocutorId} = yield select(
    thisState => thisState.userChatAccountReducer,
  );

  const chatData = {chatId: chatRoomId, interlocutorId};
  yield call(leaveChatRoomSocket, socket, chatData);
  yield put(deleteChatRoomLocalData({chatRoomId}));
}

export function* deleteChatRoomWorker(
  action: ReturnType<typeof leaveChatRoomSaga>,
): Generator<any, void, any> {
  const {socket, chatRoomId} = action.payload;

  const {interlocutorId} = yield select(
    thisState => thisState.userChatAccountReducer,
  );

  const chatData = {roomId: chatRoomId, interlocutorId};
  yield call(deleteChatRoomSocket, socket, chatData);
  yield put(deleteChatRoomLocalData({chatRoomId}));
}
