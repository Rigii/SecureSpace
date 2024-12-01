import OpenPGP from 'react-native-fast-openpgp';
import RNFS from 'react-native-fs';

export const generateAndSaveCertificate = async (
  email: string,
  uuid: string,
  privateKey: string,
  sertificateDataPassword: string,
) => {
  const certificate = `
  -----BEGIN CERTIFICATE-----
  Email: ${email}
  UUID: ${uuid}
  ${privateKey}
  -----END CERTIFICATE-----
  `;

  const encryptedData = await OpenPGP.encryptSymmetric(
    certificate,
    sertificateDataPassword,
  );

  const path = `${RNFS.DocumentDirectoryPath}/certificate.pem`;
  await RNFS.writeFile(path, encryptedData, 'utf8');
  console.log('Certificate saved to:', path);
};
