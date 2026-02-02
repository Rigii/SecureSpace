export const applicationRoutes: {
  [K in keyof RootStackParamList]: K;
} = {
  registerLogin: 'registerLogin',
  onboarding: 'onboarding',
  root: 'root',
  notFound: 'notFound',
  chatList: 'chatList',
  createChatRoom: 'createChatRoom',
  chatRoom: 'chatRoom',
  accountSettings: 'accountSettings',
  uploadKey: 'uploadKey',
};

export type RootStackParamList = {
  registerLogin: undefined;
  onboarding: undefined;
  createChatRoom: undefined;
  root: undefined;
  notFound: undefined;
  chatList: undefined;
  chatRoom: {chatId: string; participantId: string};
  accountSettings: undefined;
  uploadKey: {
    publicKey: string;
    keyRecordId: string;
    keyRecordDate?: string;
    keyType?: 'app' | 'chat';
  };
};

export type TapplicationScreens = keyof typeof applicationRoutes;
