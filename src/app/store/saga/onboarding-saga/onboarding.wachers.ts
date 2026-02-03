import {takeLatest} from 'redux-saga/effects';
import {followOnboardingSaga} from './onboarding.actions';
import {followOnboardingWorkerSaga} from './onboarding.worker';

export default function* followOnboardingWatcherSaga() {
  yield takeLatest(followOnboardingSaga.type, followOnboardingWorkerSaga);
}
