import {takeLatest} from 'redux-saga/effects';
import {createChatAccount} from './chat-account.actions';
import {createChatAccountWorkerSaga} from './create-chat-account.worker';

export default function* createChatAccountWatcherSaga() {
  yield takeLatest(createChatAccount.type, createChatAccountWorkerSaga);
}
