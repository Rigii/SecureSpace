import axios from 'axios';
import RNFS, {UploadResult} from 'react-native-fs';

const createMinioInstance = () => {
  const instance = axios.create({
    timeout: 15000,
    maxContentLength: Infinity,
    maxBodyLength: Infinity,
  });

  instance.interceptors.response.use(response => {
    if (response.status < 200 || response.status >= 300) {
      throw new Error(`Content upload failed: ${response.status}`);
    }
    return response;
  });

  return instance;
};

export const uploadMemoryContentToMinio = (
  presignedUrl: string,
  payload: ArrayBuffer | string,
) =>
  createMinioInstance().put(presignedUrl, payload, {
    headers: {
      'Content-Type': 'application/octet-stream',
    },
  });

export const uploadDiskContentInStream = async ({
  presignedUrl,
  encryptedFilePath,
  fileName,
}: {
  presignedUrl: string;
  encryptedFilePath: string;
  fileName: string;
}): Promise<UploadResult> => {
  /* stream the encrypted file content directly to the presigned URL */
  const upload = RNFS.uploadFiles({
    toUrl: presignedUrl,
    binaryStreamOnly: true,
    method: 'PUT',
    headers: {
      'Content-Type': 'application/octet-stream',
    },
    files: [
      {
        name: fileName,
        filename: fileName,
        filepath: encryptedFilePath,
        filetype: 'application/octet-stream',
      },
    ],
  });

  const result = await upload.promise;

  if (result.statusCode < 200 || result.statusCode >= 300) {
    throw new Error(`Content upload failed: ${result.statusCode}`);
  }

  return result;
};
