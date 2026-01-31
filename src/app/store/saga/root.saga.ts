import {all, call, fork} from 'redux-saga/effects';
import authSaga from './user/auth.saga';

import {applyEncryptedStorageDataToStateSaga} from './encrypted-storage/encrypted-storage.saga';

export default function* rootSaga() {
  yield all([call(applyEncryptedStorageDataToStateSaga), fork(authSaga)]);
}
