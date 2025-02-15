import OpenPGP from 'react-native-fast-openpgp';
import RNFS from 'react-native-fs';

export const generateDeviceDataKeyFile = async ({
  email,
  uuid,
  privateKey,
  sertificateDataPassword,
}: {
  email: string;
  uuid: string;
  privateKey: string;
  sertificateDataPassword: string;
}) => {
  const certificate = `
  -----BEGIN PGP PRIVATE KEY BLOCK-----
  Version: OpenPGP.js v5.0.0

  Comment: Email=${email}
  Comment: UUID=${uuid}

  ${privateKey}
  -----END PGP PRIVATE KEY BLOCK-----
  `;

  const encryptedData = await OpenPGP.encryptSymmetric(
    certificate,
    sertificateDataPassword,
  );

  const path = `${RNFS.DocumentDirectoryPath}/secure_device_data_key.pgp`;

  await RNFS.writeFile(path, encryptedData, 'utf8');

  console.log('Certificate saved to:', path);
  return path;
};
