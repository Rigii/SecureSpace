import {call, put, select} from 'redux-saga/effects';
import {createChatAccountFailed} from '../chat-account.actions';
import {
  EPopupType,
  ErrorNotificationHandler,
} from '../../../../../services/error-notification-handler';
import {strings} from '../../../../../screens/chat/chat-entry/strings';
import {getChatUserApi} from '../../../../../services/api/chat/chat-api';
import {
  EKeychainSecrets,
  getSecretKeychain,
} from '../../../../../services/secrets-keychains/store-secret-keychain';
import {
  IChatRoomId,
  IInvitations,
} from '../../../state/userChatAccount/userChatAccount.types';
import {updateUserChatsAccountSlice} from '../../../state/userChatAccount/userChatAccountAction';

export function* fetchUpdateChatStateWorker(): Generator<any, void, any> {
  try {
    const {chatAccountId, privateChatKey} = yield select(
      thisState => thisState.anonymousUserReducer.userAccountData,
    );

    const {id, token} = yield select(
      thisState => thisState.anonymousUserReducer.userAccountData,
    );

    if (chatAccountId && privateChatKey) {
      return;
    }
    const response = yield call(getChatUserApi, id, token);

    const currentPrivateKey = yield call(getSecretKeychain, {
      type: EKeychainSecrets.chatPrivateKey,
      encryptKeyDataPassword: '',
      email: response.data.email,
    });

    const storeData = {
      interlocutorId: response.data.interlocutor_id as string,
      chatAccountId: response.data.chat_account_id as string,
      created: response.data.created as Date,
      updated: response.data.updated as Date,
      email: response.data.email as string,
      chatRoomIds: response.data.chat_room_ids as IChatRoomId[],
      invitations: response.data.invitations as IInvitations[],
      publicChatKey: response.data.public_chat_key as string,
      privateChatKey: currentPrivateKey,
    };

    yield put(updateUserChatsAccountSlice(storeData));
  } catch (error) {
    const typedError = error as Error;

    ErrorNotificationHandler({
      type: EPopupType.ERROR,
      text1: strings.updateChatStateError,
      text2: typedError.message,
    });
    console.error(strings.updateChatStateError, error);
    yield put(createChatAccountFailed(typedError.message));
  }
}
