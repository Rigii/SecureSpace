import AsyncStorage from '@react-native-async-storage/async-storage';
import {Appearance} from 'react-native';

export const validateEmail = (email: string) =>
  email
    .toLowerCase()
    .match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9\wа-я]+\.)+[a-zA-Z-wа-я]{2,4}))$/,
    );

export const isJSON = (data: any) => {
  try {
    JSON.parse(data as string);
    return true;
  } catch {
    return false;
  }
};

export const isDarkMode = () => {
  const colorScheme = Appearance.getColorScheme();

  return colorScheme === 'dark';
};

export const developmentLog = (name: string, value: any) => {
  console.log(name, value);
};

export const asyncStorageLogger = async () => {
  if (!__DEV__) {
    return;
  }
  const keys = await AsyncStorage.getAllKeys();
  const result = await AsyncStorage.multiGet(keys);
  console.log('LOGGER: AsyncStorage contents:', result);
};
