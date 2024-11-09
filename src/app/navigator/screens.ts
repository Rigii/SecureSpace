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
  root: undefined;
  notFound: undefined;
};

export type TManualEncryptionScreens =
  keyof typeof manualEncryptionScreenRoutes;
