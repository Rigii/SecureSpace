export interface IChatRoomSocketState {
  chatId: string;
}

export interface IRoomInterlocutor {
  interlocutor_id: string;
  email: string;
  public_chat_key: string;
}

export interface IChatRoomContentItem {
  messageId: string;
  contentId: string;
  contentType: string;
  contentLocalPath: string;
  decryptedUrl: string;
  fileName: string;
  mimeType?: string | null;
  decryptedThumbnail: string | null;
  created?: Date;
  updated?: Date;
}
