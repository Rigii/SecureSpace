import AsyncStorage from '@react-native-async-storage/async-storage';
import {isJSON} from '../custom-services';
import {IAEncryptionLimits} from '../../app/store/state/applicationRestrictionsState/application-restrictions.types';
import {IAEncryptionPaymentSettings} from '../../app/store/state/paymentSettingsState/payment-settings.types';

enum ELocalStorage {
  manualEncryptionPlanSelected = 'manualEncryptionPlanSelected',
  users = 'users',
  emailForSignIn = 'emailForSignIn',
  isUserLoggedIn = 'isUserLoggedIn',
  allowCookies = 'allowCookies',
  contactBook = 'contactBook',
  messageParameters = 'messageParameters',
  currentDecryptionStep = 'currentDecryptionStep',
  manualDecryptionUser = 'manualDecryptionUser',
  manualEncryptionDecryptionRestrictions = 'manualEncryptionDecryptionRestrictions',
  manualEncryptionPaymentSettings = 'manualEncryptionPaymentSettings',
}

interface ISetLocalStorageData {
  storageName: ELocalStorage;
  setData: any;
}

const setLocalStorageData = ({storageName, setData}: ISetLocalStorageData) => {
  const JSONParsedData = JSON.stringify(setData);

  AsyncStorage.setItem(storageName, JSONParsedData);
};

const getParsedLocalStorageData = async (storageName: string) => {
  const currentJsonData = await AsyncStorage.getItem(storageName);

  if (!currentJsonData) {
    return;
  }

  const currentResult = isJSON(currentJsonData)
    ? JSON.parse(currentJsonData)
    : currentJsonData;
  return currentResult;
};

export const locallyEmailForSignIn = {
  set: async (signingEmail: string) => {
    await setLocalStorageData({
      storageName: ELocalStorage.emailForSignIn,
      setData: signingEmail,
    });
  },
  get: async () =>
    await getParsedLocalStorageData(ELocalStorage.emailForSignIn),
};

export const locallyManualEncryptionDecryptionRestrictions = {
  set: async (restrictions: IAEncryptionLimits) => {
    await setLocalStorageData({
      storageName: ELocalStorage.manualEncryptionDecryptionRestrictions,
      setData: restrictions,
    });
  },
  get: async () =>
    await getParsedLocalStorageData(
      ELocalStorage.manualEncryptionDecryptionRestrictions,
    ),
};

export const locallyManualEncryptionPaymentSettings = {
  set: (settings: IAEncryptionPaymentSettings) => {
    setLocalStorageData({
      storageName: ELocalStorage.manualEncryptionPaymentSettings,
      setData: settings,
    });
  },
  get: () =>
    getParsedLocalStorageData(ELocalStorage.manualEncryptionPaymentSettings),
};
