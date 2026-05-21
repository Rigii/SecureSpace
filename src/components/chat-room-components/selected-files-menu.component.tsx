import React from 'react';
import {ScrollView, Text, TouchableOpacity, View} from 'react-native';
import {strings} from '../create-update-chat/create-chat-form.strings';
import {HIT_SLOP} from '../../constants/themes';
import {PhotoIcon} from '../../assets/icons/photoContentIcon';
import {DocumentIcon} from '../../assets/icons/documentContentIcon';
import {Title3} from '../text-titles/title';
import {DocumentPickerResponse} from 'react-native-document-picker';

interface ISelectedFilesMenuProps {
  selectedMediaFiles: DocumentPickerResponse[];
  selectedDocumentFiles: DocumentPickerResponse[];
  setSelectedDocumentFiles: React.Dispatch<
    React.SetStateAction<DocumentPickerResponse[]>
  >;
  setSelectedMediaFiles: React.Dispatch<
    React.SetStateAction<DocumentPickerResponse[]>
  >;
}

export const SelectedFilesMenuComponent: React.FC<ISelectedFilesMenuProps> = ({
  selectedMediaFiles,
  selectedDocumentFiles,
  setSelectedMediaFiles,
  setSelectedDocumentFiles,
}) => {
  if (selectedMediaFiles.length === 0 && selectedDocumentFiles.length === 0) {
    return null;
  }

  const onSelectFiles = (index: number) => {
    setSelectedMediaFiles(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <ScrollView className="max-h-32 px-3 py-1 bg-white">
      {selectedMediaFiles.map((file, index) => (
        <View
          key={`media-${index}`}
          className="flex flex-row items-center py-1 space-x-2">
          <PhotoIcon />
          <Title3 className="flex-1 text-gray-700">
            {'...' + (file.name || strings.unsetName).slice(-20)}
          </Title3>
          <TouchableOpacity
            hitSlop={HIT_SLOP}
            onPress={() => onSelectFiles(index)}>
            <Text className="text-red-500 text-lg px-1">
              {String.fromCharCode(0x2715)}
            </Text>
          </TouchableOpacity>
        </View>
      ))}
      {selectedDocumentFiles.map((file, index) => (
        <View
          key={`doc-${index}`}
          className="flex flex-row items-center py-1 space-x-2">
          <DocumentIcon />
          <Title3 className="flex-1 text-gray-700">
            {'...' + (file.name || strings.unsetName).slice(-20)}
          </Title3>
          <TouchableOpacity
            hitSlop={HIT_SLOP}
            onPress={() =>
              setSelectedDocumentFiles(prev =>
                prev.filter((_, i) => i !== index),
              )
            }>
            <Text className="text-red-500 text-lg px-1">
              {String.fromCharCode(0x2715)}
            </Text>
          </TouchableOpacity>
        </View>
      ))}
    </ScrollView>
  );
};
