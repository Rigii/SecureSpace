import * as React from 'react';
import {
  TextInput,
  View,
  Text,
  TouchableOpacity,
  NativeSyntheticEvent,
  TextInputFocusEventData,
  TextInputKeyPressEventData,
} from 'react-native';
import {COLORS, HIT_SLOP} from '../../constants/themes';
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
    <View
      className={`w-full relative flex justify-center border-b-dark-blue border-b-2 ${props.className}`}>
      {!(
        (isFocused && props.hideLabelOnFocus) ||
        (props.hideLabelOnFocus && !!props.value) ||
        props.multiline
      ) && (
        <View
          className={`absolute pl-1 flex-row justify-center items-center ${props.labelWrapperClassName}`}>
          {props.icon && <View className="ml-1">{props.icon}</View>}
          <Text
            className={`ml-2 text-base ${props.labelClassName} ${
              !props.isError && 'text-red-900'
            }`}>
            {props.label}
          </Text>
          <View className="ml-1">{props.iconRight}</View>
        </View>
      )}
      {props.hideLabelOnFocus && props.icon && (
        <View
          className={`absolute pl-1 flex-row justify-center items-center ${props.labelWrapperClassName}`}>
          <View className="ml-1">{props.icon}</View>
        </View>
      )}

      <TouchableOpacity activeOpacity={1} onPress={handleInputPress}>
        <View pointerEvents="none">
          <TextInput
            ref={inputRef}
            // placeholderTextColor={props.placeholderTextColor || '#0072C5'}
            maxLength={props.maxLength}
            placeholder={props.placeholder}
            keyboardType={props.keyboardType}
            value={props.value}
            onChangeText={onChange}
            onKeyPress={catchKey}
            className={`flex flex-row relative text-base p-8 self-end	text-dark-blue text-right h-8 ${
              props.hideLabelOnFocus && 'text-left pr-10 w-full'
            }${!isFocused && props.hideLabelOnFocus && props.labelClassName} ${
              props.isError &&
              props.hideLabelOnFocus &&
              'text-red-900 ml-2 text-base'
            } ${props.icon && 'pl-5'}
            ${props.inputClassName}
            `}
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
        <View className="self-end right-5 z-50 absolute">
          {props.placeholderIcon}
        </View>
      )}

      {props.iconEnd && (
        <TouchableOpacity
          hitSlop={HIT_SLOP}
          className={`flex z-50 flex-auto self-end absolute justify-center items-center text-center	w-5 right-0 ${props.iconEndClassName}`}
          onPress={props.onIconEndPress}>
          <View className="flex flex-auto m-0 p-0 z-50">{props.iconEnd}</View>
        </TouchableOpacity>
      )}

      <TouchableOpacity
        hitSlop={HIT_SLOP}
        onPress={onLinkPress}
        className={`absolute flex flex-row justify-center right-0 ${props.linkClassName}`}>
        <Text className="text-dark-blue text-base">{props.linkText}</Text>
      </TouchableOpacity>
    </View>
  );
};