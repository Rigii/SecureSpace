import {all, call, fork} from 'redux-saga/effects';

import {applyEncryptedStorageStateSaga} from './encrypted-storage-saga/get-encrypted-storage.saga';
import authWatcherSaga from './auth-saga/auth.wachers';
import {
  chatSocketWatcherSaga,
  createChatAccountWatcherSaga,
  fetchUpdateChatStateWatcherSaga,
} from './chat-account-saga/chat-account.wachers';
import followOnboardingWatcherSaga from './onboarding-saga/onboarding.wachers';

export default function* rootSaga() {
  yield all([
    call(applyEncryptedStorageStateSaga),
    fork(authWatcherSaga),
    fork(createChatAccountWatcherSaga),
    fork(fetchUpdateChatStateWatcherSaga),
    fork(followOnboardingWatcherSaga),
    fork(chatSocketWatcherSaga),
  ]);
}
