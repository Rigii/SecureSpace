import {APP_NAME} from '@env';
import RNFS from 'react-native-fs';

export const pathConstants = {
  KEYS_USERS_SUBDIR: 'keys/users',
  APP_KEYS_DIR: 'app',
  CHAT_KEYS_DIR: 'chat',
};

export const fileNames = {
  KEY_FILE: 'key.pgp',
};

export const fileExtensions = {
  CONTENT_ENCRYPTED_EXT: '.pgp',
};

export const encryptedSubdir = {
  CONTENT_ENCRYPTED_SUBDIR: 'encrypted',
};

export const contentLocationsSubdir = {
  CHAT_ROOMS: 'chat-rooms',
  USER: 'user',
  TEMP_DOWNLOADS: 'temp-download',
};

export const contentPathDir = {
  baseDirectory: `${RNFS.DocumentDirectoryPath}/${APP_NAME}`,
  roomsContentDirectory: `${RNFS.DocumentDirectoryPath}/${APP_NAME}/${contentLocationsSubdir.CHAT_ROOMS}`,
  userContentDirectory: `${RNFS.DocumentDirectoryPath}/${APP_NAME}/${contentLocationsSubdir.USER}`,
};
