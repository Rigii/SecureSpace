import RNFS from 'react-native-fs';
import {encryptPrivateKeyBlock} from './encrypt-pkey-block';

export const generateDeviceDataKeyFile = async ({
  email,
  uuid,
  privateKey,
  encryptKeyDataPassword,
}: {
  email: string;
  uuid: string;
  privateKey: string;
  encryptKeyDataPassword: string;
}) => {
  const encryptedData = await encryptPrivateKeyBlock({
    email,
    uuid,
    privateKey,
    encryptKeyDataPassword,
  });
  const path = `${RNFS.DocumentDirectoryPath}/secure_device_data_key.pgp`;

  await RNFS.writeFile(path, encryptedData, 'utf8');

  console.log('Certificate saved to:', path);
  return path;
};
