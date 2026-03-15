// thumbnail.service.ts
import {Image} from 'react-native-compressor';
import {createThumbnail} from 'react-native-create-thumbnail';

const THUMBNAIL_OPTIONS = {
  compressionMethod: 'manual' as const,
  maxWidth: 200,
  maxHeight: 200,
  quality: 0.7,
  output: 'jpg' as const,
};

const compressImage = (fileUri: string): Promise<string> =>
  Image.compress(fileUri, THUMBNAIL_OPTIONS);

const extractVideoFrame = (fileUri: string): Promise<string> =>
  createThumbnail({
    url: fileUri,
    timeStamp: 1000,
  }).then(({path}) => path);

const generateVideoThumbnail = (fileUri: string): Promise<string> =>
  extractVideoFrame(fileUri).then(compressImage);

const generateImageThumbnail = (fileUri: string): Promise<string> =>
  compressImage(fileUri);

export const generateThumbnail = (
  fileUri: string,
  mimeType: string,
): Promise<string> =>
  mimeType.startsWith('video/')
    ? generateVideoThumbnail(fileUri)
    : generateImageThumbnail(fileUri);
