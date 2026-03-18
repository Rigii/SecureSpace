import {
  StyleProp,
  ViewStyle,
  NativeSyntheticEvent,
  TextInputFocusEventData,
} from 'react-native';

export enum KeyboardTypes {
  default = 'default',
  numberPad = 'number-pad',
  decimalPad = 'decimal-pad',
  numeric = 'numeric',
  emailAddress = 'email-address',
  phonePad = 'phone-pad',
}

export enum EAutoCapitalize {
  none = 'none',
  sentences = 'sentences',
  words = 'words',
  characters = 'characters',
}

export type TAutoCapitalize = EAutoCapitalize;

export type TKeyboardType = KeyboardTypes;

export interface IInputProps {
  inputIndex?: number;
  isNumeric?: boolean;
  key?: string | number;
  name?: string;
  style?: StyleProp<ViewStyle>;
  props?: any;
  maxLength?: number;
  placeholder?: string;
  keyboardType: TKeyboardType;
  value: string;
  onChange: (value: string, name?: string, inputIndex?: number) => void;
  catchKey?: (key: string) => void;
  option?: string;
  className?: string;
  linkClassName?: string;
  placeholderTextColor?: string;
  label?: string;
  isSecure?: boolean;
  inputClassName?: string;
  icon?: any;
  placeholderIcon?: any;
  iconRight?: any;
  textRight?: boolean;
  isError?: boolean;
  editable?: boolean;
  labelWrapperClassName?: string;
  labelClassName?: string;
  onBlur?: () => void;
  onFocus?: (e: NativeSyntheticEvent<TextInputFocusEventData>) => void;
  linkText?: string;
  onLinkPress?: () => void;
  multiline?: boolean;
  hideLabelOnFocus?: boolean;
  isFocusOnLink?: boolean;
  numberOfLines?: number;
  autoCapitalize?: TAutoCapitalize;
  isPointerEventsBlocked?: boolean;
  childComponent?: React.ReactNode;
}
