import * as React from 'react';
import {
  Text,
  View,
  StyleProp,
  ViewStyle,
  TextStyle,
  TouchableOpacity,
} from 'react-native';

import {styles} from './themed-button.style';
import {globalStyles} from '../../constants/global-styles';

export type IButtonTheme = 'light' | 'filled' | 'lightBordered';

export interface IButtonProps {
  text?: string;
  textRight?: string;
  theme: IButtonTheme;
  onPress: () => void;
  disabled?: boolean;
  children?: React.ReactNode;
  leftContent?: React.ReactNode;
  rightContent?: React.ReactNode;
  classCustomBody?: string;
  classCustomText?: string;
  classCustomContainer?: string;
  style?: {
    body?: StyleProp<ViewStyle>;
    text?: StyleProp<TextStyle>;
    container?: StyleProp<ViewStyle>;
  };
  hasShadow?: boolean;
}

const getButtonStyle = (key: IButtonTheme, hasShadow?: boolean) => {
  const themes = {
    light: {
      body: [styles.defaultButtonStyle, styles.light],
      text: [styles.defaultButtonText],
    },
    filled: {
      body: [
        styles.defaultButtonStyle,
        hasShadow && globalStyles.shadow,
        styles.filled,
      ],
      text: [styles.lightButtonText],
    },
    lightBordered: {
      body: [styles.defaultButtonStyle, styles.lightBordered],
      text: [styles.defaultButtonText],
    },
  };

  return themes[key];
};

export const ThemedButton = (props: IButtonProps) => {
  const {
    onPress,
    classCustomBody,
    classCustomText,
    classCustomContainer,
    text,
    textRight,
    theme,
    disabled,
    children,
    leftContent,
    rightContent,
    hasShadow = true,
  } = props;

  const btnStyle = getButtonStyle(theme, hasShadow);
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      className={classCustomContainer}
      style={[styles.buttonContainer, props.style?.container]}>
      <View
        className={classCustomBody}
        style={[btnStyle.body, props.style && props.style.body]}>
        {leftContent}
        {text && (
          <Text style={[btnStyle.text, props.style && props.style.text]}>
            {text}
          </Text>
        )}
        {rightContent}
        {children}
        {textRight && (
          <Text
            style={[btnStyle.text, props.style && props.style.text]}
            className={classCustomText}>
            {textRight}
          </Text>
        )}
      </View>
    </TouchableOpacity>
  );
};
