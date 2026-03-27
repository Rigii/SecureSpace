export enum EAvailableFilePathNames {
  APP_KEYS = 'APP_KEYS',
  CHAT_KEYS = 'CHAT_KEYS',
  LIBRARY = 'LIBRARY',
}

export enum EFileType {
  MEDIA = 'media',
  DOCUMENT = 'document',
}

export type TFileSessionProceedingStatus =
  | 'initialized'
  | 'uploading'
  | 'minify'
  | 'completed'
  | 'failed';

export enum EContentFileStatus {
  initialized = 'initialized',
  thumbnail_uploaded = 'thumbnail_uploaded',
  thumbnail_failed = 'thumbnail_failed',
  file_uploading = 'file_uploading',
  file_uploaded = 'file_uploaded',
  file_failed = 'file_failed',
  failed = 'failed',
  completed = 'completed',
}

export enum EUploadContentRecipientType {
  CHAT_ROOM = 'chat_room',
  USER = 'user',
}
