// export-key-file.ts
import {Platform} from 'react-native';
import RNFS from 'react-native-fs';
import DocumentPicker from 'react-native-document-picker';
import Share from 'react-native-share';

export type TExportResult =
  | {
      exported: true;
      platform: 'ios' | 'android';
      path: string; // where file lives
      via: 'user-choice' | 'default';
    }
  | {exported: false};

export const exportKeyFileWithUserChoice = async (
  localFilePath: string,
  fileName: string,
): Promise<TExportResult> => {
  // localFilePath is already in default directory
  if (Platform.OS === 'ios') {
    try {
      await Share.open({
        url: `file://${localFilePath}`,
        type: 'text/plain',
        title: 'Save encrypted key file',
        saveToFiles: true,
      });

      // iOS copies the file, original stays
      return {
        exported: true,
        platform: 'ios',
        path: localFilePath,
        via: 'user-choice',
      };
    } catch (e) {
      // User canceled share sheet
      return {
        exported: true,
        platform: 'ios',
        path: localFilePath,
        via: 'default',
      };
    }
  }

  // ANDROID
  try {
    const dir = await DocumentPicker.pickDirectory();

    if (!dir) {
      return {
        exported: true,
        platform: 'android',
        path: localFilePath,
        via: 'default',
      };
    }

    const content = await RNFS.readFile(localFilePath, 'utf8');
    const targetPath = `${dir.uri}/${fileName}`;

    await RNFS.writeFile(targetPath, content, 'utf8');

    return {
      exported: true,
      platform: 'android',
      path: targetPath,
      via: 'user-choice',
    };
  } catch (e) {
    if (DocumentPicker.isCancel(e)) {
      return {
        exported: true,
        platform: 'android',
        path: localFilePath,
        via: 'default',
      };
    }
    throw e;
  }
};
