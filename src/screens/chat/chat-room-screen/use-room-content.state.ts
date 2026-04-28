import {useState, useCallback, useEffect} from 'react';
import {IChatRoomContentItem} from './types';
import {TDecryptedContentData} from '../../../components/chat-room-components/chat-room.types';
import {getRoomContentDownloadUrl} from '../../../services/api/content/content-api';
import {IRoomAttachment} from '../../../app/store/saga/chat-account-saga/types';
import {strings} from '../chat.strings';
import {downloadContentFromMinio} from '../../../services/xhr-services/api-content-service';
import {decryptThumbnail} from '../../../services/pgp-encryption-service/encrypt-decrypt-thumbnail';
import {IChatMessage} from '../../../app/store/state/chat-rooms-content/chat-rooms-state.types';
import {useReduxSelector} from '../../../app/store/store';

export const useChatRoomContentState = ({
  messages,
}: {
  messages: IChatMessage[];
}) => {
  const {token} = useReduxSelector(
    state => state.anonymousUserReducer.userAccountData,
  );
  const {privateChatKey} = useReduxSelector(
    state => state.userChatAccountReducer,
  );
  const [roomContent, setRoomContent] = useState<
    Map<string, IChatRoomContentItem>
  >(new Map());

  const [reviewedContentItem, setReviewedContentItem] =
    useState<IChatRoomContentItem | null>(null);

  const getContentUniqueKey = ({
    messageId,
    contentId,
  }: {
    messageId: string;
    contentId: string;
  }) => `${messageId}-${contentId}`;

  const getMessageContentData = ({
    messageId,
    contentIds,
  }: {
    messageId: string;
    contentIds: string[];
  }) => {
    const contentItems = contentIds.map(contentId => {
      const contentItemKey = getContentUniqueKey({
        messageId: messageId,
        contentId,
      });
      return roomContent.get(contentItemKey);
    });

    return contentItems;
  };

  const onSetRoomContent = useCallback(
    (contentItems: TDecryptedContentData[], messageId: string) => {
      const createContentUniqueKey = (contentId: string) =>
        getContentUniqueKey({messageId, contentId});

      setRoomContent(prev => {
        const updatedContent = new Map(prev);
        contentItems.forEach(item => {
          const uniqueKey = createContentUniqueKey(item.id);
          updatedContent.set(uniqueKey, {
            messageId,
            contentId: item.id,
            contentType: item.mimeType || 'unknown',
            contentLocalPath: '',
            fileName: item.fileName,
            mimeType: item.mimeType,
            decryptedUrl: item.decryptedUrl,
            decryptedThumbnail: item.decryptedThumbnail,
          });
        });
        return updatedContent;
      });
    },
    [],
  );

  const decryptMessageThumbnails = useCallback(
    async ({
      attachments,
      messageId,
    }: {
      attachments: IRoomAttachment[];
      messageId: string;
    }) => {
      if (!attachments?.length) {
        return;
      }

      const contentPathData = attachments.map(att => ({
        objectName: att.mediaUrl,
        thumbnailObjectName: att.thumbnailUrl,
        fileName: att.fileName,
        mimeType: att.mimeType,
        id: att._id,
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
        id: string;
        thumbnailUrl: string | null;
        url: string;
        fileName: string;
        mimeType?: string | null;
      }[];

      const decryptedContentData = await Promise.all(
        downloadContentUrlData.map(
          async ({id, thumbnailUrl, url, fileName, mimeType}) => {
            if (!thumbnailUrl) {
              return {
                id,
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
                    id,
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
                  id,
                  decryptedThumbnail,
                  decryptedUrl: url,
                  fileName,
                  mimeType,
                };
              } else {
                return {
                  id,
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
                id,
                decryptedThumbnail: null,
                decryptedUrl: url,
                fileName,
                mimeType,
              };
            }
          },
        ),
      );

      onSetRoomContent(decryptedContentData, messageId);
    },
    [onSetRoomContent, privateChatKey, token],
  );

  useEffect(() => {
    if (messages.length === 0 || !privateChatKey || !token) {
      return;
    }
    messages.forEach(message => {
      if (!message.attachments?.length) {
        return;
      }
      decryptMessageThumbnails({
        attachments: message.attachments,
        messageId: message.id,
      });
    });
  }, [decryptMessageThumbnails, messages, privateChatKey, token]);

  console.log(111111, [...roomContent.values()]);

  return {
    roomContent,
    reviewedContentItem,
    setReviewedContentItem,
    onSetRoomContent,
    getMessageContentData,
  };
};
