/* Upload / Download Content Services with OpenPGP Encryption */
import {DocumentPickerResponse} from 'react-native-document-picker';
import RNFS, {UploadResult} from 'react-native-fs';
import OpenPGP from 'react-native-fast-openpgp';
import {
  downloadDiskContentInStream,
  uploadDiskContentInStream,
} from '../xhr-services/api-content-service';
import {strings} from './file-content.strings';
import {
  encryptedSubdir,
  fileExtensions,
  contentLocationsSubdir,
} from './constants';

const createEncryptedTempPath = (fileName?: string): string => {
  const baseDirectory = (
    RNFS.TemporaryDirectoryPath || RNFS.CachesDirectoryPath
  ).replace(/\/+$/, '');
  const safeFileName = (fileName || 'upload.bin').replace(
    /[^a-zA-Z0-9._-]/g,
    '_',
  );

  return `${baseDirectory}/${
    encryptedSubdir.CONTENT_ENCRYPTED_SUBDIR
  }/${Date.now()}-${safeFileName}${fileExtensions.CONTENT_ENCRYPTED_EXT}`;
};

/* Temp file path for the encrypted downloaded blob (in temp/cache dir) */
const createDownloadedEncryptedTempPath = (fileName?: string): string => {
  const baseDirectory = (
    RNFS.TemporaryDirectoryPath || RNFS.CachesDirectoryPath
  ).replace(/\/+$/, '');
  const safeFileName = (fileName || 'download.bin').replace(
    /[^a-zA-Z0-9._-]/g,
    '_',
  );

  return `${baseDirectory}/${encryptedSubdir.CONTENT_ENCRYPTED_SUBDIR}/${
    contentLocationsSubdir.DOWNLOAD
  }-${Date.now()}-${safeFileName}${fileExtensions.CONTENT_ENCRYPTED_EXT}`;
};

/* Checks whether the parent directory of a target file path exists */
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

const resolveExistingNativeFilePath = async (
  uriLikePath: string,
): Promise<string> => {
  const strippedPath = uriLikePath.startsWith('file://')
    ? uriLikePath.replace('file://', '')
    : uriLikePath;

  let decodedPath = strippedPath;
  try {
    decodedPath = decodeURI(strippedPath);
  } catch {
    decodedPath = strippedPath;
  }

  const pathCandidates = Array.from(new Set([decodedPath, strippedPath]));
  const existingPath = (
    await Promise.all(
      pathCandidates.map(async candidate => ({
        candidate,
        exists: await RNFS.exists(candidate),
      })),
    )
  ).find(item => item.exists);

  if (!existingPath) {
    throw new Error(
      `${strings.fileLocalDataIsNotAvailable}: ${pathCandidates.join(', ')}`,
    );
  }

  return existingPath.candidate;
};

/* final decrypted file destination in app storage */
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
    return `${baseDirectory}/${contentLocationsSubdir.CHAT_ROOMS}/${roomId}/${name}`;
  }

  return `${baseDirectory}/${contentLocationsSubdir.USER}/${
    folderPath || ''
  }/${name}`.replace(/\/\/+/, '/');
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
  const sourceFilePath = await resolveExistingNativeFilePath(rawSourcePath);
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
  const localContentPath = buildLocalContentPath({
    contentPathName,
    roomId,
    folderPath,
    name,
  });

  if (await RNFS.exists(localContentPath)) {
    return {contentPathName: localContentPath};
  }

  const encryptedDownloadedPath = createDownloadedEncryptedTempPath(name);

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
