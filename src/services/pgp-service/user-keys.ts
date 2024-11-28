import {
  IGeneratePGPKeyPair,
  IPGPKeys,
  generatePGPKeyPair,
} from './generate-keys';

interface TGenerateUserKeys extends IGeneratePGPKeyPair {
  saveAsyncPGPUserKeys: (keys: IPGPKeys) => void;
}

export const generateSavePGPUserKeys = async (
  options: TGenerateUserKeys,
): Promise<string> => {
  const {saveAsyncPGPUserKeys, ...otherOptions} = options;
  const pgpKeys = await generatePGPKeyPair(otherOptions);

  saveAsyncPGPUserKeys(pgpKeys);
  return pgpKeys.publicKeyArmored;
};
