import OpenPGP from 'react-native-fast-openpgp';
import {Buffer} from 'buffer';

const bufferToBase64 = (buffer: ArrayBuffer): string =>
  Buffer.from(buffer).toString('base64');

export const encryptThumbnail = async ({
  thumbnailBuffer,
  publicKeys,
}: {
  thumbnailBuffer: ArrayBuffer;
  publicKeys: string[];
}): Promise<Uint8Array> => {
  try {
    const base64Content = bufferToBase64(thumbnailBuffer);
    const concatenatedKeys = publicKeys.join('\n');

    const encrypted = await OpenPGP.encrypt(base64Content, concatenatedKeys);

    return new Uint8Array(Buffer.from(encrypted, 'utf-8'));
  } catch (error) {
    console.error('Error encrypting thumbnail:', error);
    throw error;
  }
};

export const decryptThumbnail = async ({
  encryptedThumbnail,
  privateKey,
  passphrase,
}: {
  encryptedThumbnail: ArrayBuffer;
  privateKey: string;
  passphrase?: string;
}): Promise<string> => {
  const encryptedString = Buffer.from(encryptedThumbnail).toString('utf-8');

  return await OpenPGP.decrypt(encryptedString, privateKey, passphrase || '');
};
