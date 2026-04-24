import {IRoomAttachment} from '../../app/store/saga/chat-account-saga/types';

export type ChatMessageProps = {
  message: string;
  messageId: string;
  isOwnMessage?: boolean;
  senderName?: string;
  time?: string;
  isVerified?: boolean;
  attachments?: IRoomAttachment[] | [];
  onSetRoomContent: (
    contentItems: TDecryptedContentData[],
    messageId: string,
  ) => void;
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
