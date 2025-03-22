import OpenPGP from 'react-native-fast-openpgp';

export interface IGeneratePGPKeyPair {
  userIds?: [{name: string; email?: string}];
  numBits: number;
  passphrase?: string;
}

export const generatePGPKeyPair = (options: IGeneratePGPKeyPair) => {
  const pgpKeys = OpenPGP.generate(options);
  return pgpKeys;
};
