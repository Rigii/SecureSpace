import {call, put} from 'redux-saga/effects';
import {
  EKeychainSecrets,
  getSecretKeychain,
} from '../../../../../services/secrets-keychains/store-secret-keychain';

import {updateUserChatsAccountSlice} from '../../../state/userChatAccount/userChatAccountAction';
import {addUserChatRooms} from '../../../state/chatRoomsContent/chatRoomsAction';
import {
  transformChatAccountData,
  transformChatRooms,
} from '../../auth-saga/helpers/auth-flow.transformers';

export function* loadChatDataSaga(user: any): Generator<any, void, any> {
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
