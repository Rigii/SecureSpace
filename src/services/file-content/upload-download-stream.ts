import {DocumentPickerResponse} from 'react-native-document-picker';
import RNFS, {UploadResult} from 'react-native-fs';
import OpenPGP from 'react-native-fast-openpgp';
import {
  downloadDiskContentInStream,
  uploadDiskContentInStream,
} from '../xhr-services/api-content-service';
import {strings} from './file-content.strings';
import {encryptedSubdir, fileExtensions} from './constants';

// const resolveLocalFilePath = async (
//   file: DocumentPickerResponse,
// ): Promise<string> => {
//   const sourceUri = file.fileCopyUri || file.uri;

//   if (!sourceUri) {
//     throw new Error(strings.fileURLIsNotAvailable);
//   }

//   const statTarget = sourceUri.startsWith('file://')
//     ? sourceUri.replace('file://', '')
//     : sourceUri;
//   const statResult = await RNFS.stat(statTarget);

//   return statResult.originalFilepath || statResult.path;
// };

const createEncryptedTempPath = (fileName?: string): string => {
  const baseDirectory = RNFS.TemporaryDirectoryPath || RNFS.CachesDirectoryPath;
  const safeFileName = (fileName || 'upload.bin').replace(
    /[^a-zA-Z0-9._-]/g,
    '_',
  );

  return `${baseDirectory}/${
    encryptedSubdir.CONTENT_ENCRYPTED_SUBDIR
  }/${Date.now()}-${safeFileName}${fileExtensions.CONTENT_ENCRYPTED_EXT}`;
};

const createDownloadedEncryptedTempPath = (fileName?: string): string => {
  const baseDirectory = RNFS.TemporaryDirectoryPath || RNFS.CachesDirectoryPath;
  const safeFileName = (fileName || 'download.bin').replace(
    /[^a-zA-Z0-9._-]/g,
    '_',
  );

  return `${baseDirectory}/${
    encryptedSubdir.CONTENT_ENCRYPTED_SUBDIR
  }/download-${Date.now()}-${safeFileName}${
    fileExtensions.CONTENT_ENCRYPTED_EXT
  }`;
};

const ensureParentDir = async (filePath: string): Promise<void> => {
  const lastSlashIndex = filePath.lastIndexOf('/');
  if (lastSlashIndex === -1) {
    return;
  }

  const parentDir = filePath.substring(0, lastSlashIndex);
  if (!(await RNFS.exists(parentDir))) {
    await RNFS.mkdir(parentDir);
  }
};

const buildLocalContentPath = ({
  contentPathName,
  roomId,
  folderPath,
  name,
}: {
  contentPathName?: string;
  roomId?: string;
  folderPath?: string;
  name: string;
}): string => {
  const baseDirectory = RNFS.DocumentDirectoryPath;

  if (contentPathName && contentPathName.length > 0) {
    return `${baseDirectory}/${contentPathName}`;
  }

  if (roomId) {
    return `${baseDirectory}/chat-rooms/${roomId}/${name}`;
  }

  return `${baseDirectory}/user/${folderPath || ''}/${name}`.replace(
    /\/\/+/,
    '/',
  );
};

export const uploadContentWithStream = async ({
  file,
  publicKeys,
  uploadUrl,
}: {
  file: DocumentPickerResponse;
  publicKeys: string[];
  uploadUrl: {presignedUrl: string};
}): Promise<UploadResult> => {
  if (!file.name || (!file.fileCopyUri && !file.uri)) {
    throw new Error(strings.fileLocalDataIsNotAvailable);
  }

  const rawSourcePath = file.fileCopyUri || file.uri;

  /* To get native path from file URI (no file://)  */
  const sourceFilePath = rawSourcePath.startsWith('file://')
    ? rawSourcePath.replace('file://', '')
    : rawSourcePath;
  const encryptedFilePath = createEncryptedTempPath(file.name);
  await ensureParentDir(encryptedFilePath);

  /* Chunk streaming into the encrypted file */
  await OpenPGP.encryptFile(
    sourceFilePath,
    encryptedFilePath,
    publicKeys.join('\n'),
    undefined,
    {
      isBinary: true,
      fileName: file.name,
    },
  );

  let uploadResult: UploadResult;
  try {
    uploadResult = await uploadDiskContentInStream({
      presignedUrl: uploadUrl.presignedUrl,
      encryptedFilePath,
      fileName: `${file.name}${fileExtensions.CONTENT_ENCRYPTED_EXT}`,
    });
  } catch (error) {
    if (await RNFS.exists(encryptedFilePath)) {
      await RNFS.unlink(encryptedFilePath);
    }

    throw error;
  }

  if (await RNFS.exists(encryptedFilePath)) {
    await RNFS.unlink(encryptedFilePath);
  }

  return uploadResult;
};

export const downloadContentWithStream = async ({
  presignedUrl,
  privateKey,
  passphrase,
  contentPathName,
  roomId,
  folderPath,
  name,
}: {
  presignedUrl: string;
  privateKey: string;
  passphrase?: string;
  contentPathName?: string;
  roomId?: string;
  folderPath?: string;
  name: string;
}): Promise<{contentPathName: string}> => {
  const encryptedDownloadedPath = createDownloadedEncryptedTempPath(name);
  const localContentPath = buildLocalContentPath({
    contentPathName,
    roomId,
    folderPath,
    name,
  });

  await ensureParentDir(encryptedDownloadedPath);
  await ensureParentDir(localContentPath);

  try {
    await downloadDiskContentInStream({
      presignedUrl,
      outputPath: encryptedDownloadedPath,
    });

    await OpenPGP.decryptFile(
      encryptedDownloadedPath,
      localContentPath,
      privateKey,
      passphrase || '',
    );

    return {contentPathName: localContentPath};
  } finally {
    if (await RNFS.exists(encryptedDownloadedPath)) {
      await RNFS.unlink(encryptedDownloadedPath);
    }
  }
};
