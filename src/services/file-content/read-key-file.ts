import RNFS from 'react-native-fs';
import {decryptPrivateKeyBlock} from '../pgp-encryption-service/encrypt-pkey-block';
import {ICertificateData} from '../pgp-encryption-service/types';
import {EAvailableFilePathNames} from './types';
import {getKeysDir} from './helpers';
import {fileNames} from './constants';

const strings = {
  failedToReadCertificate: 'Failed to read certificate:',
};

export const readKeyFile = async ({
  password,
  filePathName,
  uuid,
}: {
  password: string;
  filePathName: EAvailableFilePathNames;
  uuid: string;
}): Promise<ICertificateData> => {
  try {
    const filePath = getKeysDir(uuid, filePathName) + '/' + fileNames.KEY_FILE;

    const encryptedData = await RNFS.readFile(filePath, 'utf8');

    return await decryptPrivateKeyBlock({
      password,
      encryptedData,
    });
  } catch (error) {
    console.error(strings.failedToReadCertificate, error);
    throw error;
  }
};
