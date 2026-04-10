import React, {useContext} from 'react';
import {
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {EnvelopeIcon} from '../../assets/icons/evenlopeIcon';
import {ChatSocketProviderContext} from '../../context/chat/chat-provider.context';
import {Input, KeyboardTypes} from '../input';
import {strings} from '../create-update-chat/create-chat-form.strings';
import {
  EPopupType,
  ErrorNotificationHandler,
} from '../popup-message/error-notification-handler';
import {encryptSignMessageForMultipleRecipients} from '../../services/pgp-encryption-service/encrypt-decrypt-message';
import {useReduxSelector} from '../../app/store/store';
import {HIT_SLOP} from '../../constants/themes';
import {AttachIcon} from '../../assets/icons/attachIcon';
import {
  uploadFiles,
  pickDocumentFiles,
  pickMediaFiles,
} from '../../services/file-content/upload-file-flow';
import {PhotoIcon} from '../../assets/icons/photoContentIcon';
import {DocumentIcon} from '../../assets/icons/documentContentIcon';
import {Title3} from '../text-titles/title';
import {EFileType} from '../../services/file-content/types';
import {DocumentPickerResponse} from 'react-native-document-picker';

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
  const {handleSendChatRoomMessage} = useContext(ChatSocketProviderContext);

  const {privateChatKey, interlocutorId} = useReduxSelector(
    state => state.userChatAccountReducer,
  );
  const {token, id: userId} = useReduxSelector(
    state => state.anonymousUserReducer.userAccountData,
  );

  const [currentMessage, setCurrentMessage] = React.useState<string>('');

  const onAttachMedia = async () => {
    const files = await pickMediaFiles();
    setSelectedMediaFiles(files);
  };

  const onAttachDocument = async () => {
    const files = await pickDocumentFiles();
    setSelectedDocumentFiles(files);
  };

  const onUploadFiles = async () => {
    let uploadDocumentResults, uploadMediaResults;
    try {
      if (selectedDocumentFiles.length !== 0) {
        uploadDocumentResults = await uploadFiles({
          roomId: chatId,
          interlocutorId,
          userId,
          publicKeys,
          userPrivateKey: privateChatKey,
          passphrase: '',
          token,
          generateThumbnailUrl: false,
          type: EFileType.DOCUMENT,
          files: selectedDocumentFiles,
        });

        setSelectedDocumentFiles([]);
      }
    } catch (error) {
      ErrorNotificationHandler({
        text1: strings.documentsUploadFailed,
        text2: error instanceof Error ? error.message : undefined,
        type: EPopupType.ERROR,
      });
    }
    try {
      if (selectedMediaFiles.length !== 0) {
        uploadMediaResults = await uploadFiles({
          roomId: chatId,
          interlocutorId,
          userId,
          publicKeys,
          userPrivateKey: privateChatKey,
          passphrase: '',
          token,
          generateThumbnailUrl: true,
          type: EFileType.MEDIA,
          files: selectedMediaFiles,
        });
        setSelectedMediaFiles([]);
      }

      return {
        uploadDocumentResults,
        uploadMediaResults,
      };
    } catch (error) {
      ErrorNotificationHandler({
        text1: strings.mediaUploadFailed,
        // text2: error instanceof Error ? error.message : undefined,
        type: EPopupType.ERROR,
      });
    }
  };

  const onSendMessage = async () => {
    const attachments = await onUploadFiles();

    if (
      currentMessage.trim() === '' &&
      !attachments?.uploadDocumentResults?.length &&
      !attachments?.uploadMediaResults?.length
    ) {
      return;
    }

    if (publicKeys.length === 0) {
      ErrorNotificationHandler({
        text1: strings.noPBKeysReenterRoom,
        type: EPopupType.ERROR,
      });

      return;
    }
    const encryptedMessage = await encryptSignMessageForMultipleRecipients({
      message: currentMessage,
      publicKeys,
      userPrivateKey: privateChatKey,
      passphrase: '',
    });

    const currentAttachments = [
      ...(attachments?.uploadDocumentResults || []),
      ...(attachments?.uploadMediaResults || []),
    ].map(file => ({
      mediaUrl: file.contentPathName,
      thumbnailUrl: file.thumbnailPathName,
      mimeType: file.mimeType,
      fileName: file.fileName,
    }));
    console.log(111222233, {
      message: encryptedMessage,
      chatRoomId: chatId,
      attachments: currentAttachments,
    });
    handleSendChatRoomMessage({
      message: encryptedMessage,
      chatRoomId: chatId,
      attachments: currentAttachments,
    });
    setCurrentMessage('');
  };

  const actions = (
    <View
      className={
        'flex flex-row z-50 flex-auto self-end absolute  space-x-8  mr-5 right-3'
      }>
      <TouchableOpacity
        hitSlop={HIT_SLOP}
        className={'w-5'}
        onPress={() => setAttachMenuVisible(!attachMenuVisible)}>
        <View className="m-0 p-0 z-50">{<AttachIcon />}</View>
      </TouchableOpacity>
      <TouchableOpacity
        hitSlop={HIT_SLOP}
        className={'w-5'}
        onPress={onSendMessage}>
        <View className="m-0 p-0 z-50">{<EnvelopeIcon />}</View>
      </TouchableOpacity>
    </View>
  );

  const selectedFilesMenu =
    selectedMediaFiles.length > 0 || selectedDocumentFiles.length > 0 ? (
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
              onPress={() =>
                setSelectedMediaFiles(prev =>
                  prev.filter((_, i) => i !== index),
                )
              }>
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
    ) : null;

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
        childComponent={actions}
      />
      {selectedFilesMenu}
      {attachMenuVisible && inputMenu}
    </SafeAreaView>
  );
};
