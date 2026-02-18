import {takeEvery, takeLatest} from 'redux-saga/effects';
import {
  createChatAccountSaga,
  deleteChatRoomSaga,
  fetchUpdateChatStateSaga,
  handleChatSocketSaga,
  leaveChatRoomSaga,
} from './chat-account.actions';
import {handleSocketEventWorker} from './workers/chat-socket.worker';
import {createChatAccountWorkerSaga} from './workers/create-chat-account.worker';
import {fetchUpdateChatStateWorker} from './workers/fetch-update-chat.worker';
import {
  deleteChatRoomWorker,
  leaveChatRoomWorker,
} from './workers/leave-chat-room.worker';

export function* createChatAccountWatcherSaga() {
  yield takeLatest(createChatAccountSaga.type, createChatAccountWorkerSaga);
}

export function* fetchUpdateChatStateWatcherSaga() {
  yield takeLatest(fetchUpdateChatStateSaga.type, fetchUpdateChatStateWorker);
}

export function* leaveChatRoomWatcherSaga() {
  yield takeLatest(leaveChatRoomSaga.type, leaveChatRoomWorker);
}

export function* deleteChatRoomWatcherSaga() {
  yield takeLatest(deleteChatRoomSaga.type, deleteChatRoomWorker);
}

export function* chatSocketWatcherSaga(): Generator<any, void, any> {
  yield takeEvery(handleChatSocketSaga, handleSocketEventWorker);
}
