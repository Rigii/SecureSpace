import {DocumentPickerResponse} from 'react-native-document-picker';
import RNFS, {UploadResult} from 'react-native-fs';
import OpenPGP from 'react-native-fast-openpgp';
import {uploadDiskContentInStream} from '../xhr-services/api-content-service';

const resolveLocalFilePath = async (
  file: DocumentPickerResponse,
): Promise<string> => {
  const sourceUri = file.fileCopyUri || file.uri;

  if (!sourceUri) {
    throw new Error('File URI is not available');
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

  return `${baseDirectory}/encrypted-${Date.now()}-${safeFileName}.pgp`;
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
    throw new Error('File name is not available');
  }

  const sourceFilePath = await resolveLocalFilePath(file);
  const encryptedFilePath = createEncryptedTempPath(file.name);

  /* Chunk streaming into the encrypted file */
  try {
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

    return await uploadDiskContentInStream({
      presignedUrl: uploadUrl.presignedUrl,
      encryptedFilePath,
      fileName: `${file.name}.pgp`,
    });
  } finally {
    if (await RNFS.exists(encryptedFilePath)) {
      await RNFS.unlink(encryptedFilePath);
    }
  }
};
