import {call, put, select} from 'redux-saga/effects';
import {
  createChatAccountFailed,
  createChatAccountSuccess,
} from '../chat-account.actions';
import {createChatUserApi} from '../../../../../services/api/chat/chat-api';
import {generatePGPKeyPair} from '../../../../../services/pgp-encryption-service/generate-keys';
import {storeDeviceKeyWithUserChoice} from '../../../../../services/file-content/save-device-key';
import {IInvitations} from '../../../state/userChatAccount/userChatAccount.types';
import {
  EKeychainSecrets,
  storeSecretKeychain,
} from '../../../../../services/secrets-keychains/store-secret-keychain';
import {createUserChatsAccount} from '../../../state/userChatAccount/userChatAccountAction';
import {
  EPopupType,
  ErrorNotificationHandler,
} from '../../../../../services/error-notification-handler';
import {strings} from '../../../../../screens/chat/chat.strings';

export function* createChatAccountWorkerSaga(): Generator<any, void, any> {
  try {
    const {token, id, email, name} = yield select(
      thisState => thisState.anonymousUserReducer.userAccountData,
    );

    const userKeys = yield call(generatePGPKeyPair, {
      userIds: [{name: name || email, email}],
      numBits: 2048,
    });

    const response = yield call(
      createChatUserApi,
      {
        ownerEmail: email,
        ownerId: id,
        publicChatKey: userKeys.publicKey,
      },
      token,
    );

    yield call(storeSecretKeychain, {
      email,
      password: '',
      uuid: response.data.interlocutor_id,
      privateKey: userKeys.privateKey,
      type: EKeychainSecrets.chatPrivateKey,
    });

    yield call(storeDeviceKeyWithUserChoice, {
      email,
      keyUuid: response.data.interlocutor_id,
      privateKey: userKeys.privateKey,
      encryptKeyDataPassword: '',
      keyType: 'chat',
    });

    const storeData = {
      interlocutorId: response.data.interlocutor_id as string,
      chatAccountId: response.data.chat_account_id as string,
      created: response.data.created as Date,
      updated: response.data.updated as Date,
      email: response.data.email as string,
      invitations: response.data.invitations as IInvitations[],
      publicChatKey: userKeys.publicKey,
      privateChatKey: userKeys.privateKey,
    };

    yield put(createUserChatsAccount(storeData));
    yield put(createChatAccountSuccess());
  } catch (error) {
    const typedError = error as Error;
    ErrorNotificationHandler({
      type: EPopupType.ERROR,
      text1: strings.creatingChatAccountError,
      text2: typedError.message,
    });
    console.error(strings.creatingChatAccountError, error);
    yield put(createChatAccountFailed(typedError.message));
  }
}
