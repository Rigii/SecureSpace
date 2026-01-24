export const manualEncryptionScreenRoutes: {
  [K in keyof RootStackParamList]: K;
} = {
  encryption: 'encryption',
  home: 'home',
  manualDecrypt: 'manualDecrypt',
  updatePlan: 'updatePlan',
  registerLogin: 'registerLogin',
  messageUpdate: 'messageUpdate',
  networkError: 'networkError',
  messageAccessRequest: 'messageAccessRequest',
  invitation: 'invitation',
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
  encryption: undefined;
  home: undefined;
  manualDecrypt: {id: string};
  updatePlan: undefined;
  registerLogin: undefined;
  messageUpdate: undefined;
  networkError: undefined;
  messageAccessRequest: undefined;
  invitation: {inviteId: string};
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
  };
};

export type TManualEncryptionScreens =
  keyof typeof manualEncryptionScreenRoutes;
