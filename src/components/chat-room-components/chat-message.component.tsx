import React, {useEffect, useState} from 'react';
import {View, Text, Image, TouchableOpacity} from 'react-native';
import {IRoomAttachment} from '../../app/store/saga/chat-account-saga/types';
import {DocumentIcon} from '../../assets/icons/documentContentIcon';
import {Title3} from '../text-titles/title';
import {decryptThumbnail} from '../../services/pgp-encryption-service/encrypt-decrypt-thumbnail';
import {getRoomContentDownloadUrl} from '../../services/api/content/content-api';
import {useReduxSelector} from '../../app/store/store';
import {downloadContentFromMinio} from '../../services/xhr-services/api-content-service';

type ChatMessageProps = {
  message: string;
  isOwnMessage?: boolean;
  senderName?: string;
  time?: string;
  isVerified?: boolean;
  attachments?: IRoomAttachment[] | [];
};

type TDecryptedContentData = (
  | {
      decryptedThumbnail: null;
      decryptedUrl: string;
      fileName: string;
      mimeType?: string | null;
    }
  | {
      decryptedThumbnail: string;
      decryptedUrl: string;
      fileName: string;
      mimeType?: string | null;
    }
)[];

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
  const [contentData, setContentData] = useState<TDecryptedContentData>([]);

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
        console.error('No download URLs received for attachments');
        return;
      }

      const downloadUrls = responce.data.downloadUrls as {
        thumbnailUrl: string;
        url: string;
        fileName: string;
        mimeType?: string | null;
      }[];

      const decryptedContentData = await Promise.all(
        downloadUrls.map(async ({thumbnailUrl, url, fileName, mimeType}) => {
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
              console.log(11111111, thumbnailUrl);
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
              `Failed to decrypt thumbnail for ${thumbnailUrl}:`,
              error,
            );
            return {
              decryptedThumbnail: null,
              decryptedUrl: url,
              fileName,
              mimeType,
            };
          }
        }),
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
            Origin is not verified
          </Text>
        )}

        {contentData?.map((attachment, index) => (
          <TouchableOpacity
            key={index}
            className="flex flex-row items-center py-1 space-x-2 mt-2">
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
                  {attachment.fileName || 'Unnamed file'}
                </Title3>
              </View>
            )}
          </TouchableOpacity>
        ))}
      </View>

      {time && <Text className="text-[10px] text-gray-400 mt-1">{time}</Text>}
    </View>
  );
};
