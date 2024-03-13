import * as React from 'react';
import {StyleSheet} from 'react-native';
import {IInputProps} from './input.typings';
import {Input} from './input';
import {TouchableOpacity} from 'react-native-gesture-handler';

export interface IInputWithTouchProps extends IInputProps {
  onPress?: () => void;
}

export const InputWithTouch = (props: IInputWithTouchProps) => {
  if (!props.onPress) {
    return <Input {...props} />;
  }

  return (
    <TouchableOpacity
      onPress={props.onPress}
      containerStyle={styles.inputStyle}>
      <Input {...props} editable={false} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  inputStyle: {
    width: '100%',
  },
});
