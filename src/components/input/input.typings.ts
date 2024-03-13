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
  maxLength?: number;
  placeholder?: string;
  keyboardType: TKeyboardType;
  value: string;
  onChange: (option: string, value: string) => void;
  catchKey?: (key: string) => void;
  option?: string;
  className?: string;
  linkClassName?: string;
  iconEndStyle?: StyleProp<ViewStyle>;
  placeholderTextColor?: string;
  label?: string;
  isSecure?: boolean;
  inputClassName?: string;
  icon?: any;
  iconEnd?: JSX.Element;
  iconEndClassName?: string;
  placeholderIcon?: any;
  iconRight?: any;
  isError?: boolean;
  editable?: boolean;
  labelWrapperClassName?: string;
  labelClassName?: string;
  classStyles?: string;
  onBlur?: () => void;
  onFocus?: (e: NativeSyntheticEvent<TextInputFocusEventData>) => void;
  linkText?: string;
  onLinkPress?: () => void;
  onIconEndPress?: () => void;
  multiline?: boolean;
  hideLabelOnFocus?: boolean;
  isFocusOnLink?: boolean;
  numberOfLines?: number;
  autoCapitalize?: TAutoCapitalize;
}