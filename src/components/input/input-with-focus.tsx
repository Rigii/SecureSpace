import * as React from 'react';
import {
  StyleSheet,
  View,
  ScrollView,
  NativeSyntheticEvent,
  TextInputFocusEventData,
} from 'react-native';
import { IInputWithTouchProps, InputWithTouch } from './input-with-touch';
import { KEYBOARD_ACCESSORY_HEIGHT } from '@app/constants/themes';


interface IInputWithFocusProps extends IInputWithTouchProps {
  scrollRef: React.RefObject<ScrollView>;
}

export const InputWithFocus = React.forwardRef<View, IInputWithFocusProps>((props, ref) => {
  const onInputFocus = (e: NativeSyntheticEvent<TextInputFocusEventData>) => {
    props.onFocus && props.onFocus(e);
    if (!ref) return;

    (ref as React.RefObject<View>).current?.measure((x: number, y: number, width: number, height: number) => {
      if (!(props.scrollRef.current as any)?.keyboardWillOpenTo) return;
      const offsetFromKeyboard = (props.scrollRef.current as any).keyboardWillOpenTo.endCoordinates.screenY - KEYBOARD_ACCESSORY_HEIGHT;
      props.scrollRef.current?.scrollTo({ y: (y + height) - offsetFromKeyboard, x: 0, animated: true });
    });
  }

  return (
    <View
      ref={ref}
      style={styles.inputStyle}
    >
      <InputWithTouch
        {...props}
        onFocus={onInputFocus}
      />
    </View>
  );
});

const styles = StyleSheet.create({
  inputStyle: {
    width: '100%',
  }
})