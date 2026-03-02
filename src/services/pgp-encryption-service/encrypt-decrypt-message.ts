import OpenPGP from 'react-native-fast-openpgp';

export const encryptSignMessageForMultipleRecipients = async ({
  publicKeys,
  userPublicKey,
  userPrivateKey,
  passphrase,
  message,
}: {
  publicKeys: string[];
  userPublicKey?: string;
  userPrivateKey?: string;
  privateKey?: string;
  passphrase?: string;
  message: string;
}): Promise<string> => {
  const concatenatedKeys = publicKeys.join('\n');

  if (userPublicKey && userPrivateKey) {
    return await OpenPGP.encrypt(
      message,
      concatenatedKeys,
      /* message signing settings */
      {
        publicKey: userPublicKey,
        privateKey: userPrivateKey,
        passphrase: passphrase || '',
      },
    );
  }

  return await OpenPGP.encrypt(message, concatenatedKeys);
};

// export const decryptMessage = async ({
//   privateKey,
//   passphrase,
//   encryptedMessage,
// }: {
//   privateKey: string;
//   passphrase: string;
//   encryptedMessage: string;
// }): Promise<string> => {
//   const decrypted = await OpenPGP.decrypt(
//     encryptedMessage,
//     privateKey,
//     passphrase,
//   );

//   return decrypted;
// };

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
}): Promise<string> => {
  console.log(1111122, {
    senderPublicKey,
    encryptedMessage,
  });
  const decrypted = await OpenPGP.decrypt(
    encryptedMessage,
    privateKey,
    passphrase || '',
    undefined,
    {
      publicKey: senderPublicKey,
      privateKey: '', // not needed for verification
    },
  );

  return decrypted;
};

export const isEncryptedMessage = (message: string): boolean => {
  return message.includes('-----BEGIN PGP MESSAGE-----');
};
