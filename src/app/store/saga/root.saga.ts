import {all, call, fork, put} from 'redux-saga/effects';
import authSaga from './user/auth.saga';
import {
  ESecureStoredKeys,
  getSecureStorageData,
} from '../../../services/async-secure-storage/secure-storage-services';
import {setUser} from '../state/userState/userAction';

function* bootstrapSaga(): Generator<any, void, any> {
  try {
    const anonymousUser = yield call(
      getSecureStorageData,
      ESecureStoredKeys.anonymousUser,
    );

    if (anonymousUser) {
      yield put(setUser(anonymousUser));
    }
  } catch (error) {
    console.warn('[bootstrapSaga] Failed to load anonymous user', error);
  }
}

export default function* rootSaga() {
  yield all([call(bootstrapSaga), fork(authSaga)]);
}
