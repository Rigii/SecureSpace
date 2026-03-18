import axios from 'axios';

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

export const putContentToMinio = (
  presignedUrl: string,
  payload: ArrayBuffer | string,
) =>
  createMinioInstance().put(presignedUrl, payload, {
    headers: {
      'Content-Type': 'application/octet-stream',
    },
  });
