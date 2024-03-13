import Config from 'react-native-config';

export const CLIENT_ID = Config.CLIENT_ID || 'test-e0ff-4c2f-a897-test';
export const CLIENT_SECRET = Config.CLIENT_SECRET || 'test';
export const SCOPE = Config.SCOPE || '*';
export const MAPBOX_ACCESS_TOKEN = 'pk.test';
export const BASE_URL = 'https://test-api.code23.com';
export const PUSHER_ENV = {
  app_id: 1212121,
  app_key: 'test',
  cluster: 'eu',
  auth_endpoint: '/api/broadcasting/auth',
};

export const PRIVACY_POLICY_LINK = 'https://test.events/privacy-policy/';
export const TERMS_CONDITIONS_LINK = 'https://test.events/master-terms/';
