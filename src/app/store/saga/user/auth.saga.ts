import {takeLatest, call, put} from 'redux-saga/effects';
import {loginRequested, loginSuccess, loginFailed} from './authFlow.actions';
import {setUser} from '../../state/userState/userAction';
import {registerSignInUserApi} from '../../../../services/api/user/user.api';
import {ErrorNotificationHandler} from '../../../../services/error-notification-handler';
import {strings} from '../../../../screens/login-signup/login-signup.strings';
import {
  EKeychainSecrets,
  getSecretKeychain,
} from '../../../../services/secrets-keychains/store-secret-keychain';
import {updateUserChatsAccountSlice} from '../../state/userChatAccount/userChatAccountAction';
import {addUserChatRooms} from '../../state/chatRoomsContent/chatRoomsAction';
import {
  transformChatAccountData,
  transformChatRooms,
  transformUserData,
} from './helpers/authFlow.transformers';
import {navigationService} from '../../../../services/navigation/navigation.service';
import {applicationRoutes} from '../../../navigator/screens';
import {EAuthMode} from '../../../../screens/login-signup/login-sign-up.types';
import {IHttpExceptionResponse} from '../../../../services/xhr-services/xhr.types';
import {AxiosError} from 'axios';

function* authenticateUser(
  action: ReturnType<typeof loginRequested>,
): Generator<any, {user: any; token: string}, any> {
  const {email, password, mode} = action.payload;
  console.log(1111, email, password, mode);
  const {data} = yield call(
    registerSignInUserApi,
    {email, password},
    mode === EAuthMode.signUp,
  );
  console.log(2222, data);

  return {user: data.user, token: data?.token || ''};
}

function* checkEmailVerification(user: any): Generator<any, void, any> {
  if (!user.email_verified) {
    yield call(ErrorNotificationHandler, {
      text1: strings.confirmYourEmail,
      text2: strings.emailLinkPreviouslySent,
    });
    throw new Error('EMAIL_NOT_VERIFIED');
  }
}

function* checkOnboardingStatus(userInfo: any): Generator<any, void, any> {
  if (!userInfo || !userInfo.is_onboarding_done) {
    navigationService
      .getNavigationActions()
      .navigate(applicationRoutes.onboarding);

    throw new Error('ONBOARDING_REQUIRED');
  }
}

function* validateEncryptionKeys(
  user: any,
  devicePrivateKey?: string,
): Generator<any, void, any> {
  if (!devicePrivateKey) {
    const currentKeychainPrivateKey = yield call(getSecretKeychain, {
      type: EKeychainSecrets.devicePrivateKey,
      encryptKeyDataPassword: '',
      email: user.email,
    });

    if (!currentKeychainPrivateKey) {
      const publicKeys = user.user_info?.data_secrets?.user_public_keys;
      if (publicKeys?.length > 0) {
        navigationService
          .getNavigationActions()
          .navigate(applicationRoutes.uploadKey, {
            publicKey: publicKeys[0].public_key,
            keyRecordId: publicKeys[0].id,
            keyRecordDate: publicKeys[0].created,
          });

        throw new Error('ENCRYPTION_KEY_REQUIRED');
      }
    }
  }
}

function* loadChatData(user: any): Generator<any, void, any> {
  const currentPrivateKey = yield call(getSecretKeychain, {
    type: EKeychainSecrets.chatPrivateKey,
    encryptKeyDataPassword: '',
    email: user.email,
  });

  const userChatAccountData = user.user_info?.user_chat_account;

  if (userChatAccountData?.interlocutor_id) {
    const chatAccountData = transformChatAccountData(
      userChatAccountData,
      user.email,
      currentPrivateKey,
    );
    yield put(updateUserChatsAccountSlice(chatAccountData));
  }

  if (userChatAccountData?.chat_rooms) {
    const transformedChatRooms = transformChatRooms(
      userChatAccountData.chat_rooms,
    );
    yield put(addUserChatRooms(transformedChatRooms));
  }
}

// ==================== Main Saga ====================
function* loginSignUpSaga(
  action: ReturnType<typeof loginRequested>,
): Generator<any, void, any> {
  try {
    if (!navigationService.isReady()) {
      console.warn('Navigation service not ready yet');
      return;
    }
    // 1. Authenticate user
    const {user, token} = yield call(authenticateUser, action);
    console.log(22222, user, token);
    // 2. Transform and store user data
    const userData = transformUserData(user, token);
    yield put(setUser(userData));

    // 3. Check prerequisites
    yield* checkEmailVerification(user);
    yield* checkOnboardingStatus(user.user_info);
    yield* validateEncryptionKeys(
      user,
      action.payload.devicePrivateKey || undefined,
    );

    // 4. Load additional data
    yield call(loadChatData, user);

    // 5. Signal successful login
    yield put(loginSuccess());
  } catch (error: any) {
    // Handle specific error types
    if (
      error.message === 'EMAIL_NOT_VERIFIED' ||
      error.message === 'ONBOARDING_REQUIRED' ||
      error.message === 'ENCRYPTION_KEY_REQUIRED'
    ) {
      // These are handled by redirects/notifications already
      return;
    }

    const currentError = error as AxiosError<IHttpExceptionResponse>;

    console.warn(
      'Login/signup saga error:',
      currentError.response?.data.message,
    );

    const currentErrorMessage =
      currentError.response?.data.message || error.message;

    // Handle actual API/network errors
    yield put(loginFailed(currentErrorMessage || strings.loginSignupError));
    yield call(ErrorNotificationHandler, {
      text1: strings.loginSignupError,
      text2: currentErrorMessage,
    });
  }
}

// ==================== Watcher Saga ====================
export default function* authSaga(): Generator<any, void, any> {
  yield takeLatest(loginRequested.type, loginSignUpSaga);
}
