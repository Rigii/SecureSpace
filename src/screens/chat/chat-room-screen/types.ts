export interface IChatRoomSocketState {
  chatId: string;
}

export interface IRoomInterlocutor {
  interlocutor_id: string;
  email: string;
  public_chat_key: string;
}

export interface IChatRoomContent {
  messageId: string;
  contentId: string;
  contentType: string;
  contentLocalPath: string;
  fileName: string;
  mimeType?: string | null;
}
