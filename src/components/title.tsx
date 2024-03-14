import React from 'react';
import {Text, StyleProp, ViewStyle} from 'react-native';

export const Title1 = ({
  props,
  children,
  className,
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
    className={`dark:text-white text-center font-extrabold text-4xl ${className}`}>
    {children}
  </Text>
);
export const Title2 = ({
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

export const Title3 = ({
  props,
  children,
  className,
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
