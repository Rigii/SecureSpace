import React, {useContext} from 'react';
import {SafeAreaView, TouchableOpacity, View} from 'react-native';
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
import {pickAndUploadFiles} from '../../services/file-content/upload-file';
import {PhotoIcon} from '../../assets/icons/photoContentIcon';
import {DocumentIcon} from '../../assets/icons/documentContentIcon';

interface IChatInput {
  chatId: string;
  publicKeys: string[] | [];
  inputPlaceholder?: string;
}

const ChatInput: React.FC<IChatInput> = ({
  chatId,
  inputPlaceholder,
  publicKeys,
}) => {
  const [attachMenuVisible, setAttachMenuVisible] = React.useState(false);
  const {handleSendChatRoomMessage} = useContext(ChatSocketProviderContext);
  const {privateChatKey} = useReduxSelector(
    state => state.userChatAccountReducer,
  );

  const [currentMessage, setCurrentMessage] = React.useState<string>('');

  const onAttachMedia = () => {
    pickAndUploadFiles({
      roomId: chatId,
      publicKeys,
      userPrivateKey: privateChatKey,
      passphrase: '',
      token: '',
      type: 'media',
    });
  };

  const onAttachDocument = () => {
    pickAndUploadFiles({
      roomId: chatId,
      publicKeys,
      userPrivateKey: privateChatKey,
      passphrase: '',
      token: '',
      type: 'document',
    });
  };

  const onSendMessage = async () => {
    if (currentMessage.trim() === '') {
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

    handleSendChatRoomMessage({message: encryptedMessage, chatRoomId: chatId});
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

  const inputMenu = (
    <View className={'flex flex-row flex-auto self-center space-x-8 top-3'}>
      <TouchableOpacity
        hitSlop={HIT_SLOP}
        className={'w-5'}
        onPress={onAttachMedia}>
        <View className="m-0 p-0 z-50">{<PhotoIcon />}</View>
      </TouchableOpacity>
      <TouchableOpacity
        hitSlop={HIT_SLOP}
        className={'w-5'}
        onPress={onAttachDocument}>
        <View className="m-0 p-0 z-50">{<DocumentIcon />}</View>
      </TouchableOpacity>
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
      {attachMenuVisible && inputMenu}
    </SafeAreaView>
  );
};

export default ChatInput;
