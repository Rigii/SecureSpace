import React from 'react';
import {StyleProp, Text, TouchableOpacity, ViewStyle} from 'react-native';

export const TextBold = ({
  children,
  className,
  props,
  style,
}: {
  children: string;
  className?: string;
  props?: any;
  style?: StyleProp<ViewStyle>;
}) => (
  <Text
    {...props}
    style={style}
    className={`dark:text-white text-center font-extrabold text-base ${className}`}>
    {children}
  </Text>
);

export const TextNormal = ({
  children,
  className,
  props,
  style,
}: {
  children: string;
  className?: string;
  props?: any;
  style?: StyleProp<ViewStyle>;
}) => (
  <Text
    {...props}
    style={style}
    className={`dark:text-white text-center text-base ${className}`}>
    {children}
  </Text>
);

export const TextSmall = ({
  children,
  className,
  props,
  style,
}: {
  children: string;
  className?: string;
  props?: any;
  style?: StyleProp<ViewStyle>;
}) => (
  <Text
    {...props}
    style={style}
    className={`dark:text-white text-center font-extrabold text-sm ${className}`}>
    {children}
  </Text>
);

export const TextButton = ({
  children,
  className,
  value,
  props,
  style,
  onPress,
}: {
  children: string;
  className?: string;
  value?: string | number;
  props?: any;
  style?: StyleProp<ViewStyle>;
  onPress?: (value?: string | number) => void;
}) => {
  const onCurrentPress = () => {
    if (!onPress) {
      return;
    }
    onPress(value);
  };

  return (
    <TouchableOpacity {...props} style={style} onPress={onCurrentPress}>
      <Text
        className={`text-light-blue text-center font-extrabold text-base ${className}`}>
        {children}
      </Text>
    </TouchableOpacity>
  );
};
