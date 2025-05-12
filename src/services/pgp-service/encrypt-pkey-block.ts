import OpenPGP from 'react-native-fast-openpgp';

export const encryptPrivateKeyBlock = async ({
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
  const keyBlock = `
  -----BEGIN PGP PRIVATE KEY BLOCK-----
  Version: OpenPGP.js v5.0.0

  Comment: Email=${email}
  Comment: UUID=${uuid}

  ${privateKey}
  -----END PGP PRIVATE KEY BLOCK-----
  `;

  const encryptedData = await OpenPGP.encryptSymmetric(
    keyBlock,
    encryptKeyDataPassword,
  );

  return encryptedData;
};

export const decryptPrivateKeyBlock = async ({
  password,
  encryptedData,
}: {
  password: string;
  encryptedData: string;
}) => {
  try {
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
