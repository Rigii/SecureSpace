import {call, put} from 'redux-saga/effects';
import {generatePGPKeyPair} from '../../../../services/pgp-encryption-service/generate-keys';
import {
  followOnboardingSaga,
  followOnboardingFailed,
  followOnboardingSuccess,
} from './onboarding.actions';
import {Platform} from 'react-native';
import {getTime} from 'date-fns';
import {postOnboardingDataApi} from '../../../../services/api/user/user.api';
import {
  EKeychainSecrets,
  storeSecretKeychain,
} from '../../../../services/secrets-keychains/store-secret-keychain';
import {storeDeviceKeyWithUserChoice} from '../../../../services/file-content/save-device-key';
import {setSecurityData, setUser} from '../../state/user-state/user.action';
import {
  EPopupType,
  ErrorNotificationHandler,
} from '../../../../components/popup-message/error-notification-handler';
import {strings} from '../../../../screens/onboarding/strings';

export function* followOnboardingWorkerSaga(
  action: ReturnType<typeof followOnboardingSaga>,
): Generator<any, void, any> {
  const {values, token, id, email, onSuccess} = action.payload;

  try {
    const userKeys = yield call(generatePGPKeyPair, {
      userIds: [{name: values.name, email}],
      numBits: 2048,
      passphrase: values.keyPassword,
    });

    const publicKeyData = {
      publicKey: userKeys.publicKey,
      os: Platform.OS,
      date: getTime(new Date()),
      email,
      approved: true,
    };

    const response = yield call(postOnboardingDataApi, token, {
      role: 'user', // TODO: get from the global constants
      title: values.titleForm,
      isOnboardingDone: true,
      name: values.name,
      accessCredentials: values.imergencyPasswordsEmails,
      accountId: id,
      pgpPublicKey: publicKeyData,
      securePlaces: [
        {
          name: values.securePlaceName,
          securePlaceData: values.securePlaceData,
          securePlaceRadius: values.securePlaceRadius,
        },
      ],
    });
    if (!response.data?.newPublicKeysData?.id) {
      throw new Error(strings.pgpKeyIsNotAwailable);
    }

    /* Storing Master Private Key in the Keychain */
    yield call(storeSecretKeychain, {
      email,
      password: values.keyPassword,
      uuid: response.data?.newPublicKeysData?.id,
      privateKey: userKeys.privateKey,
      type: EKeychainSecrets.devicePrivateKey,
    });

    /* Storing Master Private Key in the file system */
    yield call(storeDeviceKeyWithUserChoice, {
      email,
      keyUuid: response.data?.newPublicKeysData?.id,
      privateKey: userKeys.privateKey,
      encryptKeyDataPassword: values.keyPassword,
      keyType: 'app',
    });

    const pgpDeviceKeyData = {
      devicePrivateKey: userKeys.privateKey,
      date: getTime(new Date()),
      email,
      keyUUID: response.data?.newPublicKeysData?.id,
      approved: true,
    };

    const deviceIdentifyer = {
      os: Platform.OS,
      date: getTime(new Date()),
    };

    yield put(
      setUser({
        title: values.titleForm,
        name: values.name,
        token,
      }),
    );

    yield put(
      setSecurityData({
        accessCredentials: values.imergencyPasswordsEmails,
        deviceIdentifyer,
        pgpDeviceKeyData,
        securePlaces: [
          {
            name: values.securePlaceName,
            securePlaceData: values.securePlaceData,
            securePlaceRadius: values.securePlaceRadius,
          },
        ],
      }),
    );

    yield put(followOnboardingSuccess());
    onSuccess();
  } catch (error: any) {
    const currentError = error as Error;

    ErrorNotificationHandler({
      type: EPopupType.ERROR,
      text1: strings.onboardingDataSubmitError,
      text2: currentError.name || '',
    });
    yield put(followOnboardingFailed(currentError.message));
  }
}
