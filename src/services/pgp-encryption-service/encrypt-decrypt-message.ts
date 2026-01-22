import OpenPGP from 'react-native-fast-openpgp';

export const encryptMessageForMultipleRecipients = async ({
  publicKeys,
  message,
}: {
  publicKeys: string[];
  message: string;
}): Promise<string> => {
  const concatenatedKeys = publicKeys.join('\n');

  return await OpenPGP.encrypt(message, concatenatedKeys);
};

export const decryptMessage = async ({
  privateKey,
  passphrase,
  encryptedMessage,
}: {
  privateKey: string;
  passphrase: string;
  encryptedMessage: string;
}): Promise<string> => {
  const decrypted = await OpenPGP.decrypt(
    encryptedMessage,
    privateKey,
    passphrase,
  );

  return decrypted;
};

export const isEncryptedMessage = (message: string): boolean => {
  return message.includes('-----BEGIN PGP MESSAGE-----');
};
