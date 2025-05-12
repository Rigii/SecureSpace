import React, {useContext} from 'react';
import {SafeAreaView} from 'react-native';
import {EnvelopeIcon} from '../../assets/icons/evenlopeIcon';
import {ChatSocketProviderContext} from '../../services/context/chat/chat-context-provider';
import {Input, KeyboardTypes} from '../input';

interface IChatInput {
  chatId: string;
  inputPlaceholder?: string;
}

const ChatInput: React.FC<IChatInput> = ({chatId, inputPlaceholder}) => {
  const {handleSendChatRoomMessage} = useContext(ChatSocketProviderContext);

  const [currentMessage, setCurrentMessage] = React.useState<string>('');

  const onSendMessage = () => {
    if (currentMessage.trim() === '') return;

    handleSendChatRoomMessage({message: currentMessage, chatRoomId: chatId});
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
