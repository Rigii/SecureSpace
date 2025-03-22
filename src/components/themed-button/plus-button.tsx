import React from 'react';
import {ThemedButton} from '.';

export const PlusButton = ({onPress}: {onPress: () => void}) => {
  return (
    <ThemedButton
      text="+"
      theme="filled"
      onPress={onPress}
      classCustomBody="w-16 h-16"
    />
  );
};
