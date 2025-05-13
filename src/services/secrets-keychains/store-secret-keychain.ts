import * as Keychain from 'react-native-keychain';
import OpenPGP from 'react-native-fast-openpgp';
import {strings} from './secrets-keychains.strings';

export enum EKeychainSectets {
  devicePrivateKey = 'devicePrivateKey',
  publicChatPrivateKey = 'publicChatKey',
}

export const storeSecretKeychain = async ({
  email,
  publicKeyDbUuid,
  devicePrivateKey,
  type,
  password,
}: {
  email: string;
  publicKeyDbUuid: string;
  devicePrivateKey: string;
  type: EKeychainSectets;
  password: string;
}): Promise<void> => {
  try {
    const encryptedData = await OpenPGP.encryptSymmetric(
      devicePrivateKey,
      password,
    );

    const result = await Keychain.setGenericPassword(
      publicKeyDbUuid,
      encryptedData,
      {
        service: `${type}-${email}`,
        accessControl: Keychain.ACCESS_CONTROL.BIOMETRY_ANY_OR_DEVICE_PASSCODE,
      },
    );
    console.log('Key stored successfully:', result);
  } catch (error) {
    console.error('Failed to store key:', error);
  }
};

export const getSecretKeychain = async ({
  email,
  type,
  encryptKeyDataPassword,
}: {
  email: string;
  type: EKeychainSectets;
  encryptKeyDataPassword: string;
}): Promise<string | null> => {
  try {
    const result = await Keychain.getGenericPassword({
      service: `${type}-${email}`,
    });
    if (!result) {
      throw new Error(strings.noKeyFound);
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
//"devicePrivateKey-Valakardinextra@asd.as"
