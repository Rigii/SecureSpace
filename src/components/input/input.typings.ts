import {
  StyleProp,
  ViewStyle,
  NativeSyntheticEvent,
  TextInputFocusEventData,
  TextStyle,
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
  style?: StyleProp<ViewStyle>;
  linkStyle?: StyleProp<ViewStyle>;
  iconEndStyle?: StyleProp<ViewStyle>;
  placeholderTextColor?: string;
  label?: string;
  labelStyle?: {[key: string]: number | string};
  isSecure?: boolean;
  inputStyle?: StyleProp<TextStyle>;
  icon?: any;
  iconEnd?: JSX.Element;
  placeholderIcon?: any;
  iconRight?: any;
  isError?: boolean;
  editable?: boolean;
  labelWrapperStyle?: {[key: string]: number | string};
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
