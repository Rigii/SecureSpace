import * as React from 'react';
import { StyleSheet } from 'react-native';

import { ThemedButton } from './themed-button';
import { COLORS } from '@app/constants/themes';
import { globalStyles } from '@app/constants/global-styles';

export enum EButtonColor {
  green = 'green',
  gray = 'gray'
}

export interface ISmallButtonProps {
  text?: string;
  onPress?: () => void;
  color?: EButtonColor;
  children?: React.ReactNode;
  disabled?: boolean;
  hasShadow?: boolean;
}

export const SmallButton = (props: ISmallButtonProps) => {
  const {
    text,
    onPress,
    color,
    children,
    disabled,
    hasShadow,
  } = props;

  return (
    <ThemedButton
      theme="filled"
      onPress={onPress || (() => { })}
      text={text}
      disabled={disabled}
      style={{
        body: color === EButtonColor.gray ? styles.disabledBody : styles.activeBody,
        text: color === EButtonColor.gray ? globalStyles.smallGrayText : globalStyles.smallWhiteText,
      }}
      hasShadow={hasShadow}
    >
      {children}
    </ThemedButton >
  );
};

const styles = StyleSheet.create({
  activeBody: {
    height: 25,
    width: undefined,
    borderRadius: 13,
    paddingHorizontal: 5,
  },
  disabledBody: {
    height: 25,
    width: undefined,
    borderRadius: 13,
    paddingHorizontal: 5,
    backgroundColor: COLORS.buttonGray,
  },
});