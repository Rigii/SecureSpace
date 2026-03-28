import {DocumentPickerResponse} from 'react-native-document-picker';
import RNFS, {UploadResult} from 'react-native-fs';
import OpenPGP from 'react-native-fast-openpgp';
import {uploadDiskContentInStream} from '../xhr-services/api-content-service';
import {strings} from './file-content.strings';
import {encryptedSubdir, fileExtensions} from './constants';

const resolveLocalFilePath = async (
  file: DocumentPickerResponse,
): Promise<string> => {
  const sourceUri = file.fileCopyUri || file.uri;

  if (!sourceUri) {
    throw new Error(strings.fileURLIsNotAvailable);
  }

  const statTarget = sourceUri.startsWith('file://')
    ? sourceUri.replace('file://', '')
    : sourceUri;
  const statResult = await RNFS.stat(statTarget);

  return statResult.originalFilepath || statResult.path;
};

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

export const uploadContentWithStream = async ({
  file,
  publicKeys,
  uploadUrl,
}: {
  file: DocumentPickerResponse;
  publicKeys: string[];
  uploadUrl: {presignedUrl: string};
}): Promise<UploadResult> => {
  if (!file.name) {
    throw new Error(strings.fileNameIsNotAvailable);
  }

  const sourceFilePath = await resolveLocalFilePath(file);
  const encryptedFilePath = createEncryptedTempPath(file.name);

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
