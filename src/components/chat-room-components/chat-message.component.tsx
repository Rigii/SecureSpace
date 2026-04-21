import React, {useEffect, useState} from 'react';
import {View, Text} from 'react-native';
import {decryptThumbnail} from '../../services/pgp-encryption-service/encrypt-decrypt-thumbnail';
import {getRoomContentDownloadUrl} from '../../services/api/content/content-api';
import {useReduxSelector} from '../../app/store/store';
import {downloadContentFromMinio} from '../../services/xhr-services/api-content-service';
import {strings} from './chat-room.strings';
import {ChatMessageProps, TDecryptedContentData} from './chat-room.types';
import {ContentComponent} from './message-content.component';
import {downloadContentWithStream} from '../../services/file-content/upload-download-stream';

export const ChatMessage: React.FC<ChatMessageProps> = ({
  message,
  isOwnMessage = false,
  senderName,
  time,
  isVerified,
  attachments,
}) => {
  const {token} = useReduxSelector(
    state => state.anonymousUserReducer.userAccountData,
  );
  const {privateChatKey, publicChatKey} = useReduxSelector(
    state => state.userChatAccountReducer,
  );
  const [contentData, setContentData] = useState<TDecryptedContentData[]>([]);

  const onContentPress = (attachment: TDecryptedContentData) => {
    downloadContentWithStream({
      presignedUrl: attachment.decryptedUrl,
      privateKey: privateChatKey,
      name: attachment.fileName,
    });
  };

  useEffect(() => {
    const decryptThumbnails = async () => {
      if (!attachments?.length) {
        return;
      }

      const contentPathData = attachments.map(att => ({
        objectName: att.mediaUrl,
        thumbnailObjectName: att.thumbnailUrl,
        fileName: att.fileName,
        mimeType: att.mimeType,
      }));

      const responce = await getRoomContentDownloadUrl({
        contentPathData,
        token,
      });

      if (!responce.data?.downloadUrls) {
        console.error(strings.noDownloadUrlsReceived);
        return;
      }

      const downloadContentUrlData = responce.data.downloadUrls as {
        thumbnailUrl: string | null;
        url: string;
        fileName: string;
        mimeType?: string | null;
      }[];

      const decryptedContentData = await Promise.all(
        downloadContentUrlData.map(
          async ({thumbnailUrl, url, fileName, mimeType}) => {
            if (!thumbnailUrl) {
              return {
                decryptedThumbnail: null,
                decryptedUrl: url,
                fileName,
                mimeType,
              };
            }

            try {
              if (thumbnailUrl) {
                const encryptedThumbnail = await downloadContentFromMinio(
                  thumbnailUrl,
                );
                if (!encryptedThumbnail) {
                  return {
                    decryptedThumbnail: null,
                    decryptedUrl: url,
                    fileName,
                    mimeType,
                  };
                }
                const decryptedThumbnail = await decryptThumbnail({
                  encryptedThumbnail: encryptedThumbnail,
                  privateKey: privateChatKey,
                });

                return {
                  decryptedThumbnail,
                  decryptedUrl: url,
                  fileName,
                  mimeType,
                };
              } else {
                return {
                  decryptedThumbnail: null,
                  decryptedUrl: url,
                  fileName,
                  mimeType,
                };
              }
            } catch (error) {
              console.error(
                `${strings.failedToDecryptThumbnail} ${thumbnailUrl}:`,
                error,
              );
              return {
                decryptedThumbnail: null,
                decryptedUrl: url,
                fileName,
                mimeType,
              };
            }
          },
        ),
      );
      setContentData(decryptedContentData);
    };

    decryptThumbnails();
  }, [attachments, token, privateChatKey, publicChatKey]);

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
