import {call, put} from 'redux-saga/effects';
import {loginRequestedSaga, loginSuccess, loginFailed} from './auth.actions';
import {setUser} from '../../state/userState/userAction';
import {registerSignInUserApi} from '../../../../services/api/user/user.api';
import {ErrorNotificationHandler} from '../../../../components/popup-message/error-notification-handler';
import {strings} from '../../../../screens/login-signup/login-signup.strings';
import {transformUserData} from './helpers/auth-flow.transformers';
import {navigationService} from '../../../../services/navigation/navigation.service';
import {applicationRoutes} from '../../../navigator/screens';
import {EAuthMode} from '../../../../screens/login-signup/login-sign-up.types';
import {validateEncryptionKeysSaga} from '../service-sagas/crypto/validate-encryption-keys.saga';
import {loadChatDataSaga} from '../service-sagas/chat/load-chat-data.saga';

const errorMessageCases = {
  EMAIL_NOT_VERIFIED: 'EMAIL_NOT_VERIFIED',
  ONBOARDING_REQUIRED: 'ONBOARDING_REQUIRED',
  ENCRYPTION_KEY_REQUIRED: 'ENCRYPTION_KEY_REQUIRED',
};

function* authenticateUser(
  action: ReturnType<typeof loginRequestedSaga>,
): Generator<any, {user: any; token: string}, any> {
  const {email, password, mode} = action.payload;

  const {data} = yield call(
    registerSignInUserApi,
    {email, password},
    mode === EAuthMode.signUp,
  );

  return {user: data.user, token: data?.token || ''};
}

function* checkEmailVerification(user: any): Generator<any, void, any> {
  if (!user.email_verified) {
    yield call(ErrorNotificationHandler, {
      text1: strings.confirmYourEmail,
      text2: strings.emailLinkPreviouslySent,
    });
    throw new Error(errorMessageCases.EMAIL_NOT_VERIFIED);
  }
}

function* checkOnboardingStatus(userInfo: any): Generator<any, void, any> {
  if (!userInfo || !userInfo.is_onboarding_done) {
    navigationService
      .getNavigationActions()
      .navigate(applicationRoutes.onboarding);

    throw new Error(errorMessageCases.ONBOARDING_REQUIRED);
  }
}

export default function* authWorkerSaga(
  action: ReturnType<typeof loginRequestedSaga>,
): Generator<any, void, any> {
  try {
    /* Authenticate user */
    const {user, token} = yield call(authenticateUser, action);
    const userData = transformUserData(user, token);
    yield put(setUser(userData));

    yield* checkEmailVerification(user);
    yield* checkOnboardingStatus(user.user_info);
    yield* validateEncryptionKeysSaga(
      user,
      action.payload.devicePrivateKey || undefined,
    );

    /* User chat data */
    yield call(loadChatDataSaga, user);

    yield put(loginSuccess());
  } catch (error: any) {
    if (
      error.message === errorMessageCases.EMAIL_NOT_VERIFIED ||
      error.message === errorMessageCases.ONBOARDING_REQUIRED ||
      error.message === errorMessageCases.ENCRYPTION_KEY_REQUIRED
    ) {
      /* Errors are handled by redirects/notifications already */
      return;
    }

    console.error(error.message, error.response?.data.message);

    /* Actual API/network errors */
    yield put(loginFailed(error.message || strings.loginSignupError));
    yield call(ErrorNotificationHandler, {
      text1: strings.loginSignupError,
      text2: error.message || strings.loginSignupError,
    });
  }
}
