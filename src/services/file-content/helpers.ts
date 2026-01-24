import RNFS from 'react-native-fs';
import {ROOT_DIRECTORY} from '@env';
import {pathConstants} from './constants';
import {EAvailableFilePathNames} from './types';

export const getUserKeysDir = (uuid: string) =>
  `${RNFS.DocumentDirectoryPath}/${ROOT_DIRECTORY}/${pathConstants.KEYS_USERS_SUBDIR}/${uuid}`;

export const getAppKeysDir = (uuid: string) =>
  `${getUserKeysDir(uuid)}/${pathConstants.APP_KEYS_DIR}`;

export const getChatKeysDir = (uuid: string) =>
  `${getUserKeysDir(uuid)}/${pathConstants.CHAT_KEYS_DIR}`;

export const getKeysDir = (
  uuid: string,
  filePathName: EAvailableFilePathNames,
) => {
  const dirMap = {
    [EAvailableFilePathNames.APP_KEYS]: getAppKeysDir(uuid),
    [EAvailableFilePathNames.CHAT_KEYS]: getChatKeysDir(uuid),
    [EAvailableFilePathNames.LIBRARY]: getUserKeysDir(uuid),
  };

  return dirMap[filePathName];
};

export const ensureDir = async (dirPath: string) => {
  const exists = await RNFS.exists(dirPath);
  if (!exists) {
    await RNFS.mkdir(dirPath);
  }
};
