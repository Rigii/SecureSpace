import OpenPGP from 'react-native-fast-openpgp';

export const encryptSignMessageForMultipleRecipients = async ({
  publicKeys,
  userPrivateKey,
  passphrase,
  message,
}: {
  publicKeys: string[];
  userPrivateKey?: string;
  privateKey?: string;
  passphrase?: string;
  message: string;
}): Promise<string> => {
  const concatenatedKeys = publicKeys.join('\n');
  const encrypted = await OpenPGP.encrypt(message, concatenatedKeys);

  /* PubKey identity signing/verification*/
  const signature =
    userPrivateKey &&
    (await OpenPGP.sign(encrypted, userPrivateKey, passphrase || ''));

  return JSON.stringify({encrypted, signature});
};
export const decryptMessage = async ({
  privateKey,
  passphrase,
  senderPublicKey,
  encryptedMessage,
}: {
  privateKey: string;
  passphrase?: string;
  senderPublicKey: string;
  encryptedMessage: string;
}) => {
  const {encrypted, signature} = JSON.parse(encryptedMessage);

  const verifiedOrigin = await OpenPGP.verify(
    signature,
    encrypted,
    senderPublicKey,
  );

  const message = await OpenPGP.decrypt(
    encrypted,
    privateKey,
    passphrase || '',
  );

  return {message, verifiedOrigin};
};

export const isEncryptedMessage = (message: string): boolean => {
  return message.includes('-----BEGIN PGP MESSAGE-----');
};
