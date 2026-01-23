import RNFS from 'react-native-fs';
import {encryptPrivateKeyBlock} from '../pgp-encryption-service/encrypt-pkey-block';
import {ensureDir, getKeysDir} from './helpers';
import {EAvailableFilePathNames} from './types';

export const generateEncryptionKeyFile = async ({
  email,
  uuid,
  privateKey,
  encryptKeyDataPassword,
  filePathName,
}: {
  email: string;
  uuid: string;
  privateKey: string;
  encryptKeyDataPassword: string;
  filePathName: EAvailableFilePathNames;
}) => {
  const appKeyDir = getKeysDir(uuid, filePathName);

  await ensureDir(appKeyDir);

  const encryptedData = await encryptPrivateKeyBlock({
    email,
    uuid,
    privateKey,
    encryptKeyDataPassword,
  });

  const path = `${appKeyDir}/key.pgp`;

  await RNFS.writeFile(path, encryptedData, 'utf8');
  return path;
};
