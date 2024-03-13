import React from 'react';
import {Text, TouchableOpacity} from 'react-native';

export const TextBold = ({
  children,
  className,
}: {
  children: string;
  className?: string;
}) => (
  <Text
    className={`dark:text-white text-center font-extrabold text-base ${className}`}>
    {children}
  </Text>
);

export const TextNormal = ({
  children,
  className,
}: {
  children: string;
  className?: string;
}) => (
  <Text className={`dark:text-white text-center text-base ${className}`}>
    {children}
  </Text>
);

export const TextSmall = ({
  children,
  className,
}: {
  children: string;
  className?: string;
}) => (
  <Text
    className={`dark:text-white text-center font-extrabold text-sm ${className}`}>
    {children}
  </Text>
);

export const TextButton = ({
  children,
  className,
  value,
  onPress,
}: {
  children: string;
  className?: string;
  value?: string | number;
  onPress?: (value?: string | number) => void;
}) => {
  const onCurrentPress = () => {
    if (!onPress) {
      return;
    }
    onPress(value);
  };

  return (
    <TouchableOpacity
      onPress={onCurrentPress}
      className={`text-light-blue text-center font-extrabold text-sm ${className}`}>
      <Text>{children}</Text>
    </TouchableOpacity>
  );
};
