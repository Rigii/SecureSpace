import React, {useEffect, useRef} from 'react';
import {FlatList, KeyboardAvoidingView, Platform} from 'react-native';
import {ChatMessage} from './chat-message.component';
import {IChatMessage} from '../../app/store/state/chat-rooms-content/chat-rooms-state.types';
import {IChatRoomContentItem} from '../../screens/chat/chat-room-screen/types';

interface IMessageListProps {
  messages: [] | IChatMessage[];
  participantId: string;
  getMessageContentData: ({
    messageId,
    contentIds,
  }: {
    messageId: string;
    contentIds: string[];
  }) => (IChatRoomContentItem | undefined)[];
  onContentPress: (attachment: IChatRoomContentItem) => Promise<void>;
}

const MessageList: React.FC<IMessageListProps> = ({
  messages,
  participantId,
  getMessageContentData,
  onContentPress,
}) => {
  const flatListRef = useRef<FlatList>(null);

  useEffect(() => {
    if (!flatListRef.current) {
      return;
    }

    flatListRef.current.scrollToEnd({animated: true});
  }, []);

  return (
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
            messageId={item.id}
            isOwnMessage={item.participantId === participantId}
            senderName={item.senderNickname}
            time={item.created}
            isVerified={item.verifiedOrigin}
            attachments={item.attachments}
            getMessageContentData={getMessageContentData}
            onContentPress={onContentPress}
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
  );
};

export default MessageList;
