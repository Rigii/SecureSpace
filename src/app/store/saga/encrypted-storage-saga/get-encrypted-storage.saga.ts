import {call, put} from 'redux-saga/effects';
import {
  ESecureStoredKeys,
  getSecureStorageData,
} from '../../../../services/async-secure-storage/secure-storage-services';
import {setUser} from '../../state/user-state/user.action';

export function* applyEncryptedStorageStateSaga(): Generator<any, void, any> {
  try {
    const anonymousUser = yield call(
      getSecureStorageData,
      ESecureStoredKeys.anonymousUser,
    );

    if (anonymousUser) {
      yield put(setUser(anonymousUser));
    }
  } catch (error) {
    console.warn(
      '[applyEncryptedStorageDataToStateSaga] Failed to load anonymous user',
      error,
    );
  }
}
