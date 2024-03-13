import {Toast} from 'toastify-react-native';
// import {isDarkMode} from 'constants/constantsGlobal';

export enum EPopupType {
  DEFAULT = 'DEFAULT',
  ERROR = 'ERROR',
  WARNING = 'WARNING',
  SUCCESS = 'SUCCESS',
}

export const ErrorNotificationHandler = ({
  message,
  position,
}: // type,
// position,
// customClassName,
// onclose,
{
  message: string; // | React.ReactNode;
  position?: string;

  // type: EPopupType;
  // customClassName?: string;
  // onclose?: () => void;
}) => Toast.info(message, position || 'top-center');
