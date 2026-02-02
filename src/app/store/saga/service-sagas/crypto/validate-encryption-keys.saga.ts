import {call} from 'redux-saga/effects';
import {
  EKeychainSecrets,
  getSecretKeychain,
} from '../../../../../services/secrets-keychains/store-secret-keychain';
import {navigationService} from '../../../../../services/navigation/navigation.service';
import {applicationRoutes} from '../../../../navigator/screens';

export function* validateEncryptionKeysSaga(
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
