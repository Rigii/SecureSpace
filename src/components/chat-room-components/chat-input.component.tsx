import React from 'react';
import {SafeAreaView, TouchableOpacity, View} from 'react-native';
import {Input, KeyboardTypes} from '../input';
import {strings} from '../create-update-chat/create-chat-form.strings';
import {HIT_SLOP} from '../../constants/themes';
import {
  pickDocumentFiles,
  pickMediaFiles,
} from '../../services/file-content/upload-file-flow';
import {PhotoIcon} from '../../assets/icons/photoContentIcon';
import {DocumentIcon} from '../../assets/icons/documentContentIcon';
import {Title3} from '../text-titles/title';
import {DocumentPickerResponse} from 'react-native-document-picker';
import {SelectedFilesMenuComponent} from './selected-files-menu.component';
import {ContentActionsComponent} from './content-actions.component';

interface IChatInput {
  chatId: string;
  publicKeys: string[] | [];
  inputPlaceholder?: string;
}

export const ChatInput: React.FC<IChatInput> = ({
  chatId,
  inputPlaceholder,
  publicKeys,
}) => {
  const [attachMenuVisible, setAttachMenuVisible] = React.useState(false);
  const [selectedMediaFiles, setSelectedMediaFiles] = React.useState<
    DocumentPickerResponse[]
  >([]);
  const [selectedDocumentFiles, setSelectedDocumentFiles] = React.useState<
    DocumentPickerResponse[]
  >([]);

  const [currentMessage, setCurrentMessage] = React.useState<string>('');

  const onAttachMedia = async () => {
    const files = await pickMediaFiles();

    setSelectedMediaFiles(files);
  };

  const onAttachDocument = async () => {
    const files = await pickDocumentFiles();

    setSelectedDocumentFiles(files);
  };

  const inputMenu = (
    <View className={'flex flex-row flex-auto self-center space-x-8 top-3'}>
      <View className="flex flex-col items-center">
        <Title3 className="text-opacity-gray">{strings.uploadMedia}</Title3>
        <TouchableOpacity hitSlop={HIT_SLOP} onPress={onAttachMedia}>
          <View className="m-0 p-0 z-50">{<PhotoIcon />}</View>
        </TouchableOpacity>
      </View>

      <View className="flex flex-col items-center">
        <Title3 className="text-opacity-gray">{strings.uploadDocument}</Title3>
        <TouchableOpacity hitSlop={HIT_SLOP} onPress={onAttachDocument}>
          <View className="m-0 p-0 z-50">{<DocumentIcon />}</View>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView>
      <Input
        value={currentMessage}
        onBlur={() => null}
        onChange={setCurrentMessage}
        name="room-message"
        placeholder={inputPlaceholder}
        keyboardType={KeyboardTypes.default}
        className="h-fit pl-3 pr-10 py-2 bg-white rounded-lg shadow-sm w-full"
        inputClassName="h-fit max-h-60 pb-2 pr-16sd"
        multiline={true}
        childComponent={
          <ContentActionsComponent
            message={currentMessage}
            setMessage={setCurrentMessage}
            chatId={chatId}
            publicKeys={publicKeys}
            selectedDocumentFiles={selectedDocumentFiles}
            setSelectedDocumentFiles={setSelectedDocumentFiles}
            selectedMediaFiles={selectedMediaFiles}
            setSelectedMediaFiles={setSelectedMediaFiles}
            attachMenuVisible={attachMenuVisible}
            setAttachMenuVisible={setAttachMenuVisible}
          />
        }
      />
      <SelectedFilesMenuComponent
        selectedMediaFiles={selectedMediaFiles}
        selectedDocumentFiles={selectedDocumentFiles}
        setSelectedMediaFiles={setSelectedMediaFiles}
        setSelectedDocumentFiles={setSelectedDocumentFiles}
      />
      {attachMenuVisible && inputMenu}
    </SafeAreaView>
  );
};
