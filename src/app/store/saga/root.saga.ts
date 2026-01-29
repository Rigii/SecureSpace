import {all, fork} from 'redux-saga/effects';
import authSaga from './user/auth.saga';

export default function* rootSaga() {
  yield all([fork(authSaga)]);
}
