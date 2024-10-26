// import {isDarkMode} from 'constants/constantsGlobal';

import Toast from 'react-native-toast-message';

export enum EPopupType {
  DEFAULT = 'DEFAULT',
  ERROR = 'ERROR',
  WARNING = 'WARNING',
  SUCCESS = 'SUCCESS',
}

export const ErrorNotificationHandler = ({
  text1,
  text2,
  type,
}: {
  text1: string; // | React.ReactNode;
  text2?: string;
  type?: string;
}) => {
  console.log(7777777, text1);
  Toast.show({
    type: 'info',
    text1: text1,
    text2: text2 || '',
  });
};
