import {generateKeyFile} from './create-key-file';
import {exportKeyFileWithUserChoice} from './export-key-file';
import {EAvailableFilePathNames} from './types';

export const saveDeviceKeyWithUserChoice = async ({
  email,
  keyUuid,
  privateKey,
  encryptKeyDataPassword,
  keyType,
}: {
  email: string;
  keyUuid: string;
  privateKey: string;
  encryptKeyDataPassword: string;
  keyType?: 'app' | 'chat';
}) => {
  const localPath = await generateKeyFile({
    email,
    keyUuid,
    privateKey,
    encryptKeyDataPassword,
    filePathName: EAvailableFilePathNames.LIBRARY,
    keyType,
  });

  return exportKeyFileWithUserChoice(
    localPath,
    `${keyType ?? 'device'}_key.pgp`,
  );
};
