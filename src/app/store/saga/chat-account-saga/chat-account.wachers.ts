import {takeLatest} from 'redux-saga/effects';
import {
  createChatAccountSaga,
  fetchUpdateChatStateSaga,
} from './chat-account.actions';
import {createChatAccountWorkerSaga} from './create-chat-account.worker';
import {fetchUpdateChatStateWorker} from './fetch-update-chat.worker';

export function* createChatAccountWatcherSaga() {
  yield takeLatest(createChatAccountSaga.type, createChatAccountWorkerSaga);
}

export function* fetchUpdateChatStateWatcherSaga() {
  yield takeLatest(fetchUpdateChatStateSaga.type, fetchUpdateChatStateWorker);
}
