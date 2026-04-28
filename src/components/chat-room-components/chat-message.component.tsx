import React, {useEffect, useState} from 'react';
import {View, Text} from 'react-native';
import {useReduxSelector} from '../../app/store/store';
import {strings} from './chat-room.strings';
import {ChatMessageProps} from './chat-room.types';
import {ContentComponent} from './message-content.component';
import {downloadContentWithStream} from '../../services/file-content/upload-download-stream';
import {IChatRoomContentItem} from '../../screens/chat/chat-room-screen/types';

export const ChatMessage: React.FC<ChatMessageProps> = ({
  message,
  messageId,
  isOwnMessage = false,
  senderName,
  time,
  isVerified,
  attachments,
  getMessageContentData,
}) => {
  const {privateChatKey} = useReduxSelector(
    state => state.userChatAccountReducer,
  );
  const [contentData, setContentData] = useState<IChatRoomContentItem[]>([]);

  const onContentPress = async (attachment: IChatRoomContentItem) => {
    const localFilePath = await downloadContentWithStream({
      presignedUrl: attachment.decryptedUrl,
      privateKey: privateChatKey,
      name: attachment.fileName,
    });
    // ContentPreviewModal
    console.warn(localFilePath.contentPathName);
  };

  useEffect(() => {
    if (!attachments || attachments.length === 0) {
      return;
    }

    const thisContentData = getMessageContentData({
      messageId,
      contentIds: attachments.map(att => att._id),
    }).filter((item): item is IChatRoomContentItem => item !== undefined);

    setContentData(thisContentData);
  }, [attachments, getMessageContentData, messageId]);

  return (
    <View
      className={`flex flex-col mb-2 px-3 ${
        isOwnMessage ? 'items-end' : 'items-start'
      }`}>
      {senderName && !isOwnMessage && (
        <Text className="text-xs text-gray-500 mb-1">{senderName}</Text>
      )}

      <View
        className={`max-w-[80%] px-4 py-2 rounded-2xl shadow-sm ${
          isOwnMessage
            ? 'bg-yellow-600 opacity-60 rounded-tr-none'
            : 'bg-gray-200 rounded-tl-none'
        }`}>
        <Text
          className={`text-base ${isOwnMessage ? 'text-white' : 'text-black'}`}>
          {message}
        </Text>
        {!isVerified && (
          <Text className="text-[10px] text-red-500 mt-1">
            {strings.originIsNotVerified}
          </Text>
        )}
        <ContentComponent
          attachments={contentData}
          onContentPress={onContentPress}
        />
      </View>

      {time && <Text className="text-[10px] text-gray-400 mt-1">{time}</Text>}
    </View>
  );
};
