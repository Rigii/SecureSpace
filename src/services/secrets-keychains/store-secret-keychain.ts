import * as Keychain from 'react-native-keychain';
import OpenPGP from 'react-native-fast-openpgp';

export enum EKeychainSectets {
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
  type: EKeychainSectets;
  password: string;
}): Promise<void> => {
  try {
    const encryptedData = await OpenPGP.encryptSymmetric(privateKey, password);

    const result = await Keychain.setGenericPassword(uuid, encryptedData, {
      service: `${type}-${email}`,
      accessControl: Keychain.ACCESS_CONTROL.BIOMETRY_ANY_OR_DEVICE_PASSCODE,
    });
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
