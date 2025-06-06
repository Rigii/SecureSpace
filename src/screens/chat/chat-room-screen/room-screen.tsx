import React from 'react';
import {View, FlatList, KeyboardAvoidingView, Platform} from 'react-native';
import {strings} from '../../../services/context/chat/chat-provider.strings';
import ComponentsTopBar from '../../../components/top-bar/components-top-bar/components-top-bar';
import {ChatMessage} from '../../../components/chat-room-components/chat-message.component';
import ChatInput from '../../../components/chat-room-components/chat-input.component';
import {useChatRoomSocketState} from './useChatRoomSocket.state';
import {useChatRoomMessagesState} from './useChatRoomMessages.state';

interface IChatRoomScreen {
  chatId: string;
}

const ChatRoomScreen: React.FC<IChatRoomScreen> = ({chatId}) => {
  const {publicKeys} = useChatRoomSocketState({chatId});
  const {participantId, chatRoomOptions, messages, flatListRef} =
    useChatRoomMessagesState({
      chatId,
    });

  return (
    <View className="flex-1">
      <ComponentsTopBar settingsData={chatRoomOptions} />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        className="flex-1 mt-3"
        keyboardVerticalOffset={100}>
        <FlatList
          data={messages}
          keyExtractor={item => item.id}
          ref={flatListRef}
          onContentSizeChange={() =>
            flatListRef.current?.scrollToEnd({animated: true})
          }
          renderItem={({item}) => (
            <ChatMessage
              message={item.message}
              isOwnMessage={item.participantId === participantId}
              senderName={item.senderNikName}
              time={item.created}
            />
          )}
          showsVerticalScrollIndicator={false}
          getItemLayout={(_, index) => ({
            length: 2000,
            offset: 80 * index,
            index,
          })}
        />
      </KeyboardAvoidingView>
      <ChatInput
        chatId={chatId}
        inputPlaceholder={strings.enterYourMessage}
        publicKeys={publicKeys}
      />
    </View>
  );
};

export default ChatRoomScreen;
