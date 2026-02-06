import {takeEvery, takeLatest} from 'redux-saga/effects';
import {
  createChatAccountSaga,
  fetchUpdateChatStateSaga,
  handleChatSocketEvent,
} from './chat-account.actions';
import {createChatAccountWorkerSaga} from './create-chat-account.worker';
import {fetchUpdateChatStateWorker} from './fetch-update-chat.worker';
import {handleSocketEventWorker} from './chat-socket.worker';

export function* createChatAccountWatcherSaga() {
  yield takeLatest(createChatAccountSaga.type, createChatAccountWorkerSaga);
}

export function* fetchUpdateChatStateWatcherSaga() {
  yield takeLatest(fetchUpdateChatStateSaga.type, fetchUpdateChatStateWorker);
}

export function* chatSocketWatcherSaga(): Generator<any, void, any> {
  yield takeEvery(handleChatSocketEvent.type, handleSocketEventWorker);
}
