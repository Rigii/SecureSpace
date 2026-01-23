import RNFS from 'react-native-fs';
import {decryptPrivateKeyBlock} from '../pgp-encryption-service/encrypt-pkey-block';
import {ICertificateData} from '../pgp-encryption-service/types';

export const readKeyFile = async ({
  filePath,
  password,
}: {
  filePath: string;
  password: string;
}): Promise<ICertificateData> => {
  try {
    const encryptedData = await RNFS.readFile(filePath, 'utf8');

    return await decryptPrivateKeyBlock({
      password,
      encryptedData,
    });
  } catch (error) {
    console.error('Failed to read certificate:', error);
    throw error;
  }
};
