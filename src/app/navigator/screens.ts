export const manualEncryptionScreenRoutes = {
  encryptionRoute: 'encryption',
  homeRoute: 'home',
  manualDecrypt: 'manual-decrypt',
  updatePlan: 'update-plan',
  registerLoginRoute: 'register-login',
  messageUpdateRoute: 'message-update',
  networkError: 'network-error',
  messageAccessRequest: 'access-request',
  invitation: 'invitation',
  onboarding: 'onboarding',
  root: '/',
  notFound: '*',
};

export type TManualEncryptionScreens =
  keyof typeof manualEncryptionScreenRoutes;
