import {generateKeyFile} from './create-key-file';
import {exportKeyFileWithUserChoice} from './export-key-file';
import {EAvailableFilePathNames} from './types';

export const saveDeviceKeyWithUserChoice = async ({
  email,
  uuid,
  privateKey,
  encryptKeyDataPassword,
  keyType,
}: {
  email: string;
  uuid: string;
  privateKey: string;
  encryptKeyDataPassword: string;
  keyType?: 'app' | 'chat';
}) => {
  const localPath = await generateKeyFile({
    email,
    uuid,
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
