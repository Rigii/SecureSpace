import React from 'react';
import {View} from 'react-native';
import {strings} from '../../../context/chat/chat-provider.strings';
import ComponentsTopBar from '../../../components/top-bar/components-top-bar/components-top-bar';
import {ChatInput} from '../../../components/chat-room-components/chat-input.component';
import {useChatRoomSocketState} from './use-room-socket.state';
import {useChatRoomMessagesState} from './use-room-messages.state';
import {AcceptDecline} from '../../../components/chat-item/accept-decline';
import ContentPreviewModal from '../../../components/modal-popup/content-preview-modal';
import {useChatRoomContentState} from './use-room-content.state';
import MessageList from '../../../components/chat-room-components/message-list';

interface IChatRoomScreen {
  chatId: string;
}

const ChatRoomScreen: React.FC<IChatRoomScreen> = ({chatId}) => {
  const {publicKeys, activeConnections, roomInterlocutors} =
    useChatRoomSocketState({chatId});
  const {
    roomName,
    participantId,
    chatRoomOptions,
    messages,
    isInvitationNotAccepted,
  } = useChatRoomMessagesState({
    roomInterlocutors,
    chatId,
  });

  const {
    activeContentItem,
    purgeActiveContentItem,
    getMessageContentData,
    onContentPress,
  } = useChatRoomContentState({
    messages,
  });

  return (
    <View className="flex-1">
      <ComponentsTopBar
        settingsData={chatRoomOptions}
        title={roomName}
        activeConnections={activeConnections}
        roomInterlocutors={roomInterlocutors}
      />
      {isInvitationNotAccepted ? <AcceptDecline chatId={chatId} /> : null}
      <MessageList
        messages={messages}
        participantId={participantId}
        getMessageContentData={getMessageContentData}
        onContentPress={onContentPress}
      />
      <ChatInput
        chatId={chatId}
        inputPlaceholder={strings.enterYourMessage}
        publicKeys={publicKeys}
      />
      <ContentPreviewModal
        isOpen={activeContentItem !== null}
        contentType={activeContentItem?.contentType || ''}
        contentLocalPath={activeContentItem?.contentLocalPath || ''}
        indexNumber={0}
        contentName={activeContentItem?.fileName || ''}
        contentDate={new Date()}
        onClose={purgeActiveContentItem}
      />
    </View>
  );
};

export default ChatRoomScreen;
