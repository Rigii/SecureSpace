import {takeLatest} from 'redux-saga/effects';
import {loginRequestedSaga} from './auth.actions';
import authWorkerSaga from './auth.worker';

export default function* authWatcherSaga(): Generator<any, void, any> {
  yield takeLatest(loginRequestedSaga.type, authWorkerSaga);
}
