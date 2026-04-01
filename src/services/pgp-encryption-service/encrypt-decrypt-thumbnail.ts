import OpenPGP from 'react-native-fast-openpgp';
import {Buffer} from 'buffer';

const bufferToBase64 = (buffer: ArrayBuffer): string =>
  Buffer.from(buffer).toString('base64');

const base64ToBuffer = (base64: string): ArrayBuffer =>
  Buffer.from(base64, 'base64').buffer as ArrayBuffer;

export const encryptThumbnail = async ({
  thumbnailBuffer,
  publicKeys,
  userPrivateKey,
  passphrase,
}: {
  thumbnailBuffer: ArrayBuffer;
  publicKeys: string[];
  userPrivateKey?: string;
  passphrase?: string;
}): Promise<string> => {
  const base64Content = bufferToBase64(thumbnailBuffer);
  const concatenatedKeys = publicKeys.join('\n');

  const encrypted = await OpenPGP.encrypt(base64Content, concatenatedKeys);

  const signature =
    userPrivateKey &&
    (await OpenPGP.sign(encrypted, userPrivateKey, passphrase || ''));

  return JSON.stringify({encrypted, signature});
};

export const decryptThumbnail = async ({
  encryptedThumbnail,
  privateKey,
  passphrase,
  senderPublicKey,
}: {
  encryptedThumbnail: string;
  privateKey: string;
  passphrase?: string;
  senderPublicKey: string;
}): Promise<ArrayBuffer> => {
  const {encrypted, signature} = JSON.parse(encryptedThumbnail);

  const verifiedOrigin = await OpenPGP.verify(
    signature,
    encrypted,
    senderPublicKey,
  );

  if (!verifiedOrigin) {
    throw new Error('Thumbnail signature verification failed');
  }

  const decrypted = await OpenPGP.decrypt(
    encrypted,
    privateKey,
    passphrase || '',
  );

  return base64ToBuffer(decrypted);
};
