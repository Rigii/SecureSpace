import RNFS from 'react-native-fs';
import {createThumbnail} from 'react-native-create-thumbnail';
import {Image} from 'react-native-compressor';

const normalizeUri = async (fileUri: string): Promise<string> => {
  // PHAsset URI — must be copied to a temp file first
  if (fileUri.startsWith('ph://')) {
    const tempPath = `${RNFS.TemporaryDirectoryPath}/${Date.now()}.mov`;
    await RNFS.copyAssetsVideoIOS(fileUri, tempPath);
    return `file://${tempPath}`;
  }

  return fileUri.startsWith('file://') ? fileUri : `file://${fileUri}`;
};

const extractVideoFrame = async (fileUri: string): Promise<string> => {
  try {
    const response = await createThumbnail({
      url: fileUri.replace('file://', ''),
      timeStamp: 0,
      format: 'jpeg',
      maxWidth: 200,
      maxHeight: 200,
    });

    return response.path;
  } catch (err) {
    throw err;
  }
};

const THUMBNAIL_OPTIONS = {
  compressionMethod: 'manual' as const,
  maxWidth: 200,
  maxHeight: 200,
  quality: 0.7,
  output: 'jpg' as const,
};

const compressImage = (fileUri: string): Promise<string> =>
  Image.compress(fileUri, THUMBNAIL_OPTIONS);

const generateVideoThumbnail = async (fileUri: string): Promise<string> => {
  const normalizedUri = await normalizeUri(fileUri); // ✅ export PHAsset first
  const frame = await extractVideoFrame(normalizedUri);
  return compressImage(frame);
};

const generateImageThumbnail = (fileUri: string): Promise<string> =>
  compressImage(fileUri);

const isVideo = (mimeType: string, fileUri: string): boolean =>
  mimeType.startsWith('video/') ||
  fileUri.toLowerCase().endsWith('.mov') ||
  fileUri.toLowerCase().endsWith('.mp4');

export const generateThumbnail = (
  fileUri: string,
  mimeType: string,
): Promise<string> =>
  isVideo(mimeType, fileUri)
    ? generateVideoThumbnail(fileUri)
    : generateImageThumbnail(fileUri);
