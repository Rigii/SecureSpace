import EncryptedStorage from 'react-native-encrypted-storage';
import {strings} from './strings';

export enum ESecureStoredKeys {
  anonymousUser = 'anonymousUser',
}

export const saveSecureStorageData = async <T>({
  key,
  data,
}: {
  key: ESecureStoredKeys;
  data: T;
}) => {
  await EncryptedStorage.setItem(key, JSON.stringify(data));
};

export const getSecureStorageData = async (key: ESecureStoredKeys) => {
  try {
    const data = await EncryptedStorage.getItem(key);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error(strings.errorLoadingAnonymousData + ` ${key}`, error);
    return null;
  }
};
