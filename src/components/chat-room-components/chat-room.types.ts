import {IRoomAttachment} from '../../app/store/saga/chat-account-saga/types';
import {IChatRoomContentItem} from '../../screens/chat/chat-room-screen/types';

export type ChatMessageProps = {
  message: string;
  messageId: string;
  isOwnMessage?: boolean;
  senderName?: string;
  time?: string;
  isVerified?: boolean;
  attachments?: IRoomAttachment[] | [];
  getMessageContentData: ({
    messageId,
    contentIds,
  }: {
    messageId: string;
    contentIds: string[];
  }) => (IChatRoomContentItem | undefined)[];
};

export type TDecryptedContentData =
  | {
      id: string;
      decryptedThumbnail: null;
      decryptedUrl: string;
      fileName: string;
      mimeType?: string | null;
    }
  | {
      id: string;
      decryptedThumbnail: string;
      decryptedUrl: string;
      fileName: string;
      mimeType?: string | null;
    };
