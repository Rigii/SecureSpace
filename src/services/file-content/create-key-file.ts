import RNFS from 'react-native-fs';
import {encryptPrivateKeyBlock} from '../pgp-encryption-service/encrypt-pkey-block';
import {ensureDir, getKeysDir} from './helpers';
import {EAvailableFilePathNames} from './types';
import {fileNames} from './constants';

export const generateKeyFile = async ({
  email,
  uuid,
  privateKey,
  encryptKeyDataPassword,
  filePathName,
  keyType,
}: {
  email: string;
  uuid: string;
  privateKey: string;
  encryptKeyDataPassword: string;
  filePathName: EAvailableFilePathNames;
  keyType?: 'app' | 'chat';
}) => {
  const appKeyDir = getKeysDir(uuid, filePathName);

  await ensureDir(appKeyDir);

  const encryptedData = await encryptPrivateKeyBlock({
    email,
    uuid,
    privateKey,
    encryptKeyDataPassword,
  });

  const path = `${appKeyDir}/${keyType ? `${keyType}_` : ''}${
    fileNames.KEY_FILE
  }`;

  await RNFS.writeFile(path, encryptedData, 'utf8');
  return path;
};
