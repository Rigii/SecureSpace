import OpenPGP from 'react-native-fast-openpgp';
import RNFS from 'react-native-fs';

interface CertificateData {
  email: string;
  uuid: string;
  privateKey: string;
}

export const readKeyFile = async ({
  filePath,
  password,
}: {
  filePath: string;
  password: string;
}): Promise<CertificateData> => {
  try {
    const encryptedData = await RNFS.readFile(filePath, 'utf8');

    const decryptedData = await OpenPGP.decryptSymmetric(
      encryptedData,
      password,
    );

    const emailMatch = decryptedData.match(/Email: (.+)/);
    const uuidMatch = decryptedData.match(/UUID: (.+)/);
    const privateKeyMatch = decryptedData.match(
      /-----BEGIN PGP PRIVATE KEY BLOCK-----[\s\S]*?-----END PGP PRIVATE KEY BLOCK-----/,
    );

    if (!emailMatch || !uuidMatch || !privateKeyMatch) {
      throw new Error('Invalid certificate format');
    }

    return {
      email: emailMatch[1].trim(),
      uuid: uuidMatch[1].trim(),
      privateKey: privateKeyMatch[0].trim(),
    };
  } catch (error) {
    console.error('Failed to read certificate:', error);
    throw error;
  }
};
