export const manualEncryptionScreenRoutes = {
  encryptionRoute: 'encryption',
  homeRoute: 'home',
  testEncryptionRootRoute: '/manual_encrypt',
  testManualDecrypt: '/manual_decrypt',
  manualDecrypt: 'manual_decrypt',
  updatePlan: 'update_plan',
  registerLoginRoute: 'register_login',
  messageUpdateRoute: 'message-update',
  networkError: 'network-error',
  messageAccessRequest: 'access-request',
  invitation: 'invitation',
  root: '/',
  notFound: '*',
};

export type TManualEncryptionScreens =
  keyof typeof manualEncryptionScreenRoutes;
