import {all, call, fork} from 'redux-saga/effects';

import {applyEncryptedStorageStateSaga} from './encrypted-storage-saga/get-encrypted-storage.saga';
import authWatcherSaga from './auth-saga/auth.wachers';
import createChatAccountWatcherSaga from './chat-account-saga/chat-account.wachers';

export default function* rootSaga() {
  yield all([
    call(applyEncryptedStorageStateSaga),
    fork(authWatcherSaga),
    fork(createChatAccountWatcherSaga),
  ]);
}
