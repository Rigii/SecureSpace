import {useRef, useState} from 'react';
import {UserInitialData} from './onboarding-cases/user-initial-data';
import {ImergencyPasswords} from './onboarding-cases/imergency-passwords';
import {SecurePlaces} from './onboarding-cases/secure-places';
import {SwiperRef} from './onboarding.types';
import {useDispatch} from 'react-redux';
import {
  setSecurityData,
  setUser,
} from '../../app/store/state/userState/userAction';
import {postOnboardingDataApi} from '../../services/api/user/user.api';
import {useReduxSelector} from '../../app/store/store';
import {
  EPopupType,
  ErrorNotificationHandler,
} from '../../services/ErrorNotificationHandler';
import {generatePGPKeyPair} from '../../services/pgp-encryption-service/generate-keys';
import {getTime} from 'date-fns';
import {Platform} from 'react-native';
import {generateDeviceDataKeyFile} from '../../services/pgp-encryption-service/create-key-file';
import {DownloadKey} from './onboarding-cases/download-key';
import {IOnboardingFormValues} from '../../app/store/state/onboardingState/onboardingStateTypes';

import {
  EKeychainSectets,
  storeSecretKeychain,
} from '../../services/secrets-keychains/store-secret-keychain';

export const useOnboardingFlowState = () => {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const swiperRef = useRef<SwiperRef>(null);
  const {userAccountData} = useReduxSelector(
    state => state.anonymousUserReducer,
  );
  const formState = useReduxSelector(state => state.onboardingFormReducer);
  const dispatch = useDispatch();

  const saveKeyOnDevice = async ({
    email,
    password,
    keyUUID,
    devicePrivateKey,
  }: {
    email: string;
    password: string;
    keyUUID: string;
    devicePrivateKey: string;
  }) => {
    await generateDeviceDataKeyFile({
      email,
      uuid: keyUUID,
      privateKey: devicePrivateKey,
      encryptKeyDataPassword: password,
    });
  };

  const onSubmit = async (values: IOnboardingFormValues) => {
    const userKeys = await generatePGPKeyPair({
      userIds: [{name: values.name, email: userAccountData.email}],
      numBits: 2048,
      passphrase: values.keyPassword,
    });

    const publicKeyData = {
      publicKey: userKeys.publicKey,
      os: Platform.OS,
      date: getTime(new Date()),
      email: userAccountData.email,
      approved: true,
    };

    try {
      const response = await postOnboardingDataApi(userAccountData.token, {
        role: 'user', // TODO: get from the global constants
        title: values.titleForm,
        isOnboardingDone: true,
        name: values.name,
        accessCredentials: values.imergencyPasswordsEmails,
        accountId: userAccountData.id,
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
        throw new Error('PGP Key id is not awailable');
      }

      /* Storing Master Private Key in the Keychain */
      await storeSecretKeychain({
        email: userAccountData.email,
        password: values.keyPassword,
        publicKeyDbUuid: response.data?.newPublicKeysData?.id,
        devicePrivateKey: userKeys.privateKey,
        type: EKeychainSectets.devicePrivateKey,
      });

      if (values.saveKeyOnDevice) {
        await saveKeyOnDevice({
          email: userAccountData.email,
          password: values.keyPassword,
          keyUUID: response.data?.newPublicKeysData?.id,
          devicePrivateKey: userKeys.privateKey,
        });
      }

      const pgpDeviceKeyData = {
        devicePrivateKey: userKeys.privateKey,
        date: getTime(new Date()),
        email: userAccountData.email,
        keyUUID: response.data?.newPublicKeysData?.id,
        approved: true,
      };

      const deviceIdentifyer = {
        os: Platform.OS,
        date: getTime(new Date()),
      };

      dispatch(
        setUser({
          title: values.titleForm,
          name: values.name,
          token: userAccountData.token,
        }),
      );

      dispatch(
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

      setIsSubmitted(true);
    } catch (error) {
      const currentError = error as Error;

      ErrorNotificationHandler({
        type: EPopupType.ERROR,
        text1: 'Onboarding data submit error',
        text2: currentError.name || '',
      });
    }
  };

  const onNextPage = () => {
    swiperRef?.current?.scrollBy(1, true);
  };

  const navigateToMain = () =>
    dispatch(
      setUser({
        isOnboardingDone: true,
      }),
    );

  return {
    isSubmitted,
    swiperRef,
    formState,
    navigateToMain,
    onNextPage,
    onSubmit,
    dispatch,
    ImergencyPasswords,
    UserInitialData,
    SecurePlaces,
    DownloadKey,
  };
};
