import React, {useContext} from 'react';
import {SafeAreaView} from 'react-native';
import {EnvelopeIcon} from '../../assets/icons/evenlopeIcon';
import {ChatSocketProviderContext} from '../../context/chat/chat-provider.context';
import {Input, KeyboardTypes} from '../input';
import {strings} from '../create-update-chat/create-chat-form.strings';
import {
  EPopupType,
  ErrorNotificationHandler,
} from '../popup-message/error-notification-handler';
import {encryptMessageForMultipleRecipients} from '../../services/pgp-encryption-service/encrypt-decrypt-message';

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
  const {handleSendChatRoomMessage} = useContext(ChatSocketProviderContext);

  const [currentMessage, setCurrentMessage] = React.useState<string>('');

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

    const encryptedMessage = await encryptMessageForMultipleRecipients({
      message: currentMessage,
      publicKeys,
    });

    handleSendChatRoomMessage({message: encryptedMessage, chatRoomId: chatId});
    setCurrentMessage('');
  };

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
        inputClassName="h-fit max-h-60 pb-2 pr-4"
        multiline={true}
        iconEnd={<EnvelopeIcon />}
        onIconEndPress={onSendMessage}
        iconEndClassName="flex-1 mr-5"
      />
    </SafeAreaView>
  );
};

export default ChatInput;
