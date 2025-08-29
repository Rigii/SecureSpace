import OpenPGP from 'react-native-fast-openpgp';

export const encryptMessageForMultipleRecipients = async ({
  publicKeys,
  message,
}: {
  publicKeys: string[];
  message: string;
}): Promise<{recipientPublicKey: string; encrypted: string}[]> => {
  const encryptedMessages = await Promise.all(
    publicKeys.map(async publicKey => {
      const encrypted = await OpenPGP.encrypt(message, publicKey);

      return {
        recipientPublicKey: publicKey,
        encrypted,
      };
    }),
  );

  return encryptedMessages;
};
