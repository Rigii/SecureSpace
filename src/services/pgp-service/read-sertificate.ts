import OpenPGP from 'react-native-fast-openpgp';
import {ICertificateData} from './types';

const parseCertificate = (certificate: string): ICertificateData => {
  const emailMatch = certificate.match(/Email:\s*(.+)/);
  const uuidMatch = certificate.match(/UUID:\s*(.+)/);
  const privateKeyMatch = certificate.match(
    /-----BEGIN CERTIFICATE-----[\s\S]*?\n([\s\S]*?)\n-----END CERTIFICATE-----/,
  );

  if (!emailMatch || !uuidMatch || !privateKeyMatch) {
    throw new Error('Invalid certificate format.');
  }

  return {
    email: emailMatch[1].trim(),
    uuid: uuidMatch[1].trim(),
    privateKey: privateKeyMatch[1].trim(),
  };
};

export const readCertificate = async (
  encryptedCertificate: string,
  password: string,
): Promise<ICertificateData | null> => {
  try {
    const decryptedData = await OpenPGP.decryptSymmetric(
      encryptedCertificate,
      password,
    );

    const certificateData = JSON.parse(decryptedData);

    return parseCertificate(certificateData);
  } catch (error) {
    console.error('Error reading certificate:', error);
    return null;
  }
};
