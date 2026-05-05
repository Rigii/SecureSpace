import React, {useContext} from 'react';
import {TouchableOpacity, View} from 'react-native';
import {EnvelopeIcon} from '../../assets/icons/evenlopeIcon';
import {ChatSocketProviderContext} from '../../context/chat/chat-provider.context';
import {strings} from '../create-update-chat/create-chat-form.strings';
import {
  EPopupType,
  ErrorNotificationHandler,
} from '../popup-message/error-notification-handler';
import {encryptSignMessageForMultipleRecipients} from '../../services/pgp-encryption-service/encrypt-decrypt-message';
import {useReduxSelector} from '../../app/store/store';
import {HIT_SLOP} from '../../constants/themes';
import {AttachIcon} from '../../assets/icons/attachIcon';
import {uploadFiles} from '../../services/file-content/upload-file-flow';
import {EContentCategory} from '../../services/file-content/types';
import {DocumentPickerResponse} from 'react-native-document-picker';

interface IContentActions {
  message: string;
  chatId: string;
  publicKeys: string[] | [];
  inputPlaceholder?: string;
  selectedDocumentFiles: DocumentPickerResponse[];
  setMessage: React.Dispatch<React.SetStateAction<string>>;
  setSelectedDocumentFiles: React.Dispatch<
    React.SetStateAction<DocumentPickerResponse[]>
  >;
  selectedMediaFiles: DocumentPickerResponse[];
  setSelectedMediaFiles: React.Dispatch<
    React.SetStateAction<DocumentPickerResponse[]>
  >;
  attachMenuVisible?: boolean;
  setAttachMenuVisible: React.Dispatch<React.SetStateAction<boolean>>;
}

export const ContentActionsComponent: React.FC<IContentActions> = ({
  message,
  setMessage,
  chatId,
  publicKeys,
  selectedDocumentFiles,
  selectedMediaFiles,
  setSelectedMediaFiles,
  setSelectedDocumentFiles,
  attachMenuVisible,
  setAttachMenuVisible,
}) => {
  const {handleSendChatRoomMessage} = useContext(ChatSocketProviderContext);

  const {privateChatKey, interlocutorId} = useReduxSelector(
    state => state.userChatAccountReducer,
  );
  const {token, id: userId} = useReduxSelector(
    state => state.anonymousUserReducer.userAccountData,
  );

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
          type: EContentCategory.DOCUMENT,
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
          type: EContentCategory.MEDIA,
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
      message.trim() === '' &&
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
      message,
      publicKeys,
      userPrivateKey: privateChatKey,
      passphrase: '',
    });

    /* Sending Media and Document Attachments as a single array */
    const currentAttachments = [
      ...(attachments?.uploadDocumentResults || []),
      ...(attachments?.uploadMediaResults || []),
    ].map(file => ({
      mediaUrl: file.contentPathName,
      thumbnailUrl: file.thumbnailPathName,
      mimeType: file.mimeType,
      fileName: file.fileName,
    }));

    handleSendChatRoomMessage({
      message: encryptedMessage,
      chatRoomId: chatId,
      attachments: currentAttachments,
    });
    setMessage('');
  };

  return (
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
};
