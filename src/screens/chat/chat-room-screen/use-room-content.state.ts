import {useState} from 'react';
import {IChatRoomContent} from './types';
import {TDecryptedContentData} from '../../../components/chat-room-components/chat-room.types';

export const useChatRoomContentState = () => {
  const [roomContent, setRoomContent] = useState<Map<string, IChatRoomContent>>(
    new Map(),
  );

  const [reviewedContentItem, setReviewedContentItem] =
    useState<IChatRoomContent | null>(null);

  const onSetRoomContent = (
    contentItems: TDecryptedContentData[],
    messageId: string,
  ) => {
    const createContentUniqueKey = (contentId: string) =>
      `${messageId}-${contentId}`;

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
        });
      });
      return updatedContent;
    });
  };

  return {
    roomContent,
    reviewedContentItem,
    setReviewedContentItem,
    onSetRoomContent,
  };
};
