import * as React from 'react';
import {
  TextInput,
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  NativeSyntheticEvent,
  TextInputFocusEventData,
  TextInputKeyPressEventData,
} from 'react-native';
import {COLORS, FONTS, FONT_SIZE, HIT_SLOP} from '../../constants/themes';
import {IInputProps, EAutoCapitalize} from './input.typings';

export const Input = (props: IInputProps) => {
  const [isFocused, setIsFocused] = React.useState(false);
  const inputRef = React.createRef<TextInput>();

  const onChange = (value: string) => {
    props.onChange(props.option || '', value);
  };

  const catchKey = ({
    nativeEvent,
  }: NativeSyntheticEvent<TextInputKeyPressEventData>) => {
    if (!props.catchKey) return;
    props.catchKey(nativeEvent.key);
  };

  const setFocus = () => {
    setIsFocused(!isFocused);
  };

  const onBlur = () => {
    setFocus();
    props.onBlur && props.onBlur();
  };

  const onFocus = (e: NativeSyntheticEvent<TextInputFocusEventData>) => {
    setFocus();
    props.onFocus && props.onFocus(e);
  };

  const onLinkPress = () => {
    props.onLinkPress && props.onLinkPress();
    props.isFocusOnLink && inputRef.current?.focus();
  };

  const handleInputPress = () => {
    if (inputRef.current && (props.editable || props.editable === undefined)) {
      inputRef.current.focus();
    }
  };

  return (
    <View style={[styles.wrapper, props.style]}>
      {!(
        (isFocused && props.hideLabelOnFocus) ||
        (props.hideLabelOnFocus && !!props.value) ||
        props.multiline
      ) && (
        <View style={[styles.labelWrapper, props.labelWrapperStyle]}>
          {props.icon && <View style={styles.labelIcon}>{props.icon}</View>}
          <Text
            style={
              (!props.isError && [styles.label, props.labelStyle]) || [
                props.labelStyle,
                styles.labelError,
              ]
            }>
            {props.label}
          </Text>
          <View style={styles.labelIcon}>{props.iconRight}</View>
        </View>
      )}
      {props.hideLabelOnFocus && props.icon && (
        <View style={[styles.labelWrapper, props.labelWrapperStyle]}>
          <View style={styles.labelIcon}>{props.icon}</View>
        </View>
      )}

      <TouchableOpacity activeOpacity={1} onPress={handleInputPress}>
        <View pointerEvents="none">
          <TextInput
            ref={inputRef}
            placeholderTextColor={
              props.placeholderTextColor || COLORS.lightGreen
            }
            maxLength={props.maxLength}
            placeholder={props.placeholder}
            keyboardType={props.keyboardType}
            value={props.value}
            onChangeText={onChange}
            onKeyPress={catchKey}
            style={[
              styles.input,
              styles.inputOffset,
              props.multiline && styles.multilineInput,
              props.hideLabelOnFocus && styles.inputWithoutLabel,
              !isFocused && props.hideLabelOnFocus && props.labelStyle,
              props.isError && props.hideLabelOnFocus && styles.labelError,
              props.icon && styles.iconOffset,
              props.inputStyle,
            ]}
            secureTextEntry={props.isSecure}
            onFocus={onFocus}
            onBlur={onBlur}
            editable={props.editable}
            multiline={props.multiline}
            numberOfLines={props.numberOfLines}
            autoCapitalize={
              props.autoCapitalize ||
              (props.isSecure
                ? EAutoCapitalize.none
                : EAutoCapitalize.sentences)
            }
          />
        </View>
      </TouchableOpacity>

      {props.value?.length === 0 && !isFocused && (
        <View style={styles.placeholderIcon}>{props.placeholderIcon}</View>
      )}

      {props.iconEnd && (
        <TouchableOpacity
          hitSlop={HIT_SLOP}
          style={[styles.iconEnd, props.iconEndStyle]}
          onPress={props.onIconEndPress}>
          <View style={{flex: 1, margin: 0, padding: 0, zIndex: 9999}}>
            {props.iconEnd}
          </View>
        </TouchableOpacity>
      )}

      <TouchableOpacity
        hitSlop={HIT_SLOP}
        onPress={onLinkPress}
        style={[styles.linkWrapper, props.linkStyle]}>
        <Text style={styles.link}>{props.linkText}</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    width: '100%',
    position: 'relative',
    display: 'flex',
    justifyContent: 'center',
    borderBottomColor: COLORS.borderGray,
    borderBottomWidth: 1,
  },
  iconOffset: {
    paddingLeft: 40,
  },
  multilineInput: {
    textAlignVertical: 'top',
    textAlign: 'left',
    paddingHorizontal: 20,
  },
  inputWithoutLabel: {
    textAlign: 'left',
    paddingRight: 60,
    width: '100%',
  },
  inputOffset: {
    height: 50,
  },
  input: {
    position: 'relative',
    fontFamily: FONTS.medium,
    fontSize: FONT_SIZE.small,
    paddingHorizontal: 20,
    display: 'flex',
    flexDirection: 'row',
    alignSelf: 'flex-end',
    color: COLORS.lightGreen,
    textAlign: 'right',
  },
  labelWrapper: {
    position: 'absolute',
    paddingLeft: 15,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  label: {
    marginLeft: 9,
    fontFamily: FONTS.medium,
  },
  labelError: {
    marginLeft: 9,
    fontFamily: FONTS.medium,
    color: COLORS.red,
  },
  labelIcon: {
    marginLeft: 9,
  },
  placeholderIcon: {
    alignSelf: 'flex-end',
    right: 20,
    zIndex: 9999,
    position: 'absolute',
  },
  iconEnd: {
    zIndex: 9999,
    display: 'flex',
    flex: 1,
    alignSelf: 'flex-end',
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
    width: 20,
    right: 0,
  },
  linkWrapper: {
    position: 'absolute',
    flexDirection: 'row',
    justifyContent: 'center',
    right: 0,
  },
  link: {
    color: COLORS.lightGreen,
    fontFamily: FONTS.medium,
  },
  unfocused: {
    color: COLORS.black,
  },
});
