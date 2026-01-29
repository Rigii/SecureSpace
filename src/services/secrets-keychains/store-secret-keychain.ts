import * as Keychain from 'react-native-keychain';
import OpenPGP from 'react-native-fast-openpgp';
import {strings} from './secrets-keychains.strings';

export enum EKeychainSecrets {
  devicePrivateKey = 'devicePrivateKey',
  chatPrivateKey = 'chatPrivateKey',
}

export const storeSecretKeychain = async ({
  email,
  uuid,
  privateKey,
  type,
  password,
}: {
  email: string;
  uuid: string;
  privateKey: string;
  type: EKeychainSecrets;
  password: string;
}): Promise<void> => {
  try {
    const encryptedData = await OpenPGP.encryptSymmetric(privateKey, password);

    const result = await Keychain.setGenericPassword(uuid, encryptedData, {
      service: `${type}-${email}`,
      accessControl: Keychain.ACCESS_CONTROL.BIOMETRY_ANY_OR_DEVICE_PASSCODE,
    });
    console.log(strings.keyStoredSuccessfully, result);
  } catch (error) {
    console.error(strings.failedToStoreKey, error);
  }
};

export const getSecretKeychain = async ({
  email,
  type,
  encryptKeyDataPassword,
}: {
  email: string;
  type: EKeychainSecrets;
  encryptKeyDataPassword: string;
}): Promise<string | null> => {
  try {
    const result = await Keychain.getGenericPassword({
      service: `${type}-${email}`,
    });

    if (!result) {
      console.log(strings.noKeyFoundInKeychain, type);
      return '';
    }

    const decryptedData = await OpenPGP.decryptSymmetric(
      result.password,
      encryptKeyDataPassword,
    );
    return decryptedData;
  } catch (error) {
    throw error;
  }
};
