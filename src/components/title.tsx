import React from 'react';
import {Text} from 'react-native';

export const Title1 = ({
  children,
  className,
}: {
  children: string;
  className?: string;
}) => (
  <Text
    className={`dark:text-white text-center font-extrabold text-4xl ${className}`}>
    {children}
  </Text>
);
export const Title2 = ({
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

export const Title3 = ({
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
