import {takeLatest} from 'redux-saga/effects';
import {createChatAccountSaga} from './chat-account.actions';
import {createChatAccountWorkerSaga} from './create-chat-account.worker';

export default function* createChatAccountWatcherSaga() {
  yield takeLatest(createChatAccountSaga.type, createChatAccountWorkerSaga);
}
