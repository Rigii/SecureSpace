import {IRoomAttachment} from '../../app/store/saga/chat-account-saga/types';

export type ChatMessageProps = {
  message: string;
  isOwnMessage?: boolean;
  senderName?: string;
  time?: string;
  isVerified?: boolean;
  attachments?: IRoomAttachment[] | [];
};

export type TDecryptedContentData =
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
    };
