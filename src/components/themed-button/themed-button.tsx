import * as React from 'react';
import {Text, View, StyleProp, ViewStyle, TouchableOpacity} from 'react-native';

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
  style?: StyleProp<ViewStyle>;
  hasShadow?: boolean;
}

const getButtonStyle = (key: IButtonTheme, hasShadow?: boolean) => {
  const themes = {
    light: {
      body: `${styles.defaultButtonStyle} ${styles.light}`,
      text: styles.defaultButtonText,
    },
    filled: {
      body: `${styles.defaultButtonStyle} ${
        (hasShadow && globalStyles.shadow) || ''
      } ${styles.filled}`,
      text: styles.lightButtonText,
    },
    lightBordered: {
      body: `${styles.defaultButtonStyle} ${styles.lightBordered}`,
      text: styles.defaultButtonText,
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
      className={`items-center ${classCustomContainer}`}
      style={props.style}>
      <View className={`${btnStyle.body} ${classCustomBody}`}>
        {leftContent}
        {text && (
          <Text className={`${btnStyle.text} ${classCustomText}`}>{text}</Text>
        )}
        {rightContent}
        {children}
        {textRight && (
          <Text className={`${btnStyle.text} ${classCustomText}`}>
            {textRight}
          </Text>
        )}
      </View>
    </TouchableOpacity>
  );
};
