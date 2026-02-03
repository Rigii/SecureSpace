import {takeLatest} from 'redux-saga/effects';
import {loginRequested} from './auth.actions';
import authWorkerSaga from './auth.worker';

export default function* authWatcherSaga(): Generator<any, void, any> {
  yield takeLatest(loginRequested.type, authWorkerSaga);
}
