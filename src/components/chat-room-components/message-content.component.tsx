import React from 'react';
import {View, Image, TouchableOpacity} from 'react-native';
import {DocumentIcon} from '../../assets/icons/documentContentIcon';
import {Title3} from '../text-titles/title';
import {strings} from './chat-room.strings';
import {IChatRoomContentItem} from '../../screens/chat/chat-room-screen/types';

export const ContentComponent = ({
  attachments,
  onContentPress,
}: {
  attachments: IChatRoomContentItem[] | [];
  onContentPress: (attachment: IChatRoomContentItem) => void;
}) => {
  return (
    <View>
      {attachments?.map((attachment, index) => (
        <TouchableOpacity
          key={index}
          className="flex flex-row items-center py-1 space-x-2 mt-2"
          onPress={() => onContentPress(attachment)}>
          {attachment?.decryptedThumbnail ? (
            <Image
              source={{
                uri: `data:${attachment.mimeType};base64,${attachment.decryptedThumbnail}`,
              }}
              className="w-40 h-40 rounded"
              resizeMode="cover"
            />
          ) : (
            <View className="flex flex-row items-center">
              <DocumentIcon />
              <Title3 className="text-gray-700 ml-2">
                {attachment.fileName || strings.unnamedFile}
              </Title3>
            </View>
          )}
        </TouchableOpacity>
      ))}
    </View>
  );
};
