// export-key-file.ts
import {Platform} from 'react-native';
import RNFS from 'react-native-fs';
import DocumentPicker from 'react-native-document-picker';
import Share from 'react-native-share';

export type ExportResult =
  | {platform: 'ios'; exported: true}
  | {platform: 'android'; exported: true; path: string}
  | {exported: false};

export const exportKeyFileWithUserChoice = async (
  localFilePath: string,
  fileName: string,
): Promise<ExportResult> => {
  if (Platform.OS === 'ios') {
    // iOS: Save to Files dialog
    await Share.open({
      url: `file://${localFilePath}`,
      type: 'text/plain',
      title: 'Save encrypted key file',
      saveToFiles: true,
    });

    return {platform: 'ios', exported: true};
  }

  // ANDROID
  try {
    const dir = await DocumentPicker.pickDirectory();

    const content = await RNFS.readFile(localFilePath, 'utf8');
    const targetPath = `${dir.uri}/${fileName}`;

    await RNFS.writeFile(targetPath, content, 'utf8');

    return {
      platform: 'android',
      exported: true,
      path: targetPath,
    };
  } catch (e) {
    if (DocumentPicker.isCancel(e)) {
      return {exported: false};
    }
    throw e;
  }
};
