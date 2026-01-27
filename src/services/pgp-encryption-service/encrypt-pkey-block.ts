import OpenPGP from 'react-native-fast-openpgp';

export const encryptPrivateKeyBlock = async ({
  email,
  /*Key DB record uuid*/
  keyUuid,
  privateKey,
  encryptKeyDataPassword,
}: {
  email: string;
  keyUuid: string;
  privateKey: string;
  encryptKeyDataPassword: string;
}) => {
  const keyBlock = `
  -----BEGIN APPLICATION KEY BLOCK-----
  Version: OpenPGP.js v5.0.0

  Email=${email}
  UUID=${keyUuid}
  PKey=${privateKey}
  -----END APPLICATION KEY BLOCK-----
  `;

  const encryptedData = await OpenPGP.encryptSymmetric(
    keyBlock,
    encryptKeyDataPassword,
  );

  return encryptedData;
};

export const decryptPrivateKeyBlock = async ({
  encryptedData,
  password,
  email,
  /*Key DB record uuid*/
  keyUuid,
}: {
  encryptedData: string;
  password: string;
  email: string;
  keyUuid: string;
}) => {
  const decryptedData = await OpenPGP.decryptSymmetric(encryptedData, password);

  if (!decryptedData) {
    throw new Error('Failed to decrypt key block');
  }

  const emailMatch = decryptedData.match(/Email=(.*)/);
  const uuidMatch = decryptedData.match(/UUID=(.*)/);
  const pkeyMatch = decryptedData.match(
    /^ *PKey=([\s\S]*?)-----END PGP PRIVATE KEY BLOCK-----/m,
  );

  if (!emailMatch || !uuidMatch || !pkeyMatch) {
    throw new Error('Invalid key block format');
  }

  const decryptedEmail = emailMatch[1].trim();
  const decryptedUUID = uuidMatch[1].trim();
  const privateKey = pkeyMatch[1] + '-----END PGP PRIVATE KEY BLOCK-----';

  if (decryptedEmail !== email) {
    throw new Error('Email does not match key block');
  }

  if (decryptedUUID !== keyUuid) {
    throw new Error('UUID does not match key block');
  }

  return {
    email: decryptedEmail,
    keyUuid: decryptedUUID,
    privateKey,
  };
};
