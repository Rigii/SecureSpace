import * as openpgp from 'react-native-openpgp';

export interface IPGPKeys {
  publicKeyArmored: string;
  privateKeyArmored: string;
}

export interface IGeneratePGPKeyPair {
  userIds: [{name: string; email: string}];
  numBits: number;
  passphrase: string;
}

export const generatePGPKeyPair = async (
  options: IGeneratePGPKeyPair,
): Promise<IPGPKeys> => {
  const pgpKeys = await openpgp.generateKey(options);
  return pgpKeys;
};
