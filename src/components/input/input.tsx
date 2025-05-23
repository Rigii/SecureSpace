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
import {HIT_SLOP} from '../../constants/themes';
import {IInputProps, EAutoCapitalize} from './input.typings';

export const Input = (props: IInputProps) => {
  const [isFocused, setIsFocused] = React.useState(false);
  const inputRef = React.createRef<TextInput>();

  const onChange = (value: string) => {
    if (props.isNumeric) {
      const numericValue = value.replace(/[^0-9]/g, '');
      props.onChange(numericValue, props.name);
      return;
    }
    props.onChange(value, props.name, props.inputIndex);
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
      style={props.style}
      key={props.key}
      className={`flex relative justify-center ${props.className}`}>
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
              !!props.isError && 'text-red-500'
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
        <View pointerEvents={props.isPointerEventsBlocked ? 'none' : 'auto'}>
          <TextInput
            ref={inputRef}
            placeholderTextColor={props.placeholderTextColor || '#35353580'}
            maxLength={props.maxLength}
            placeholder={props.placeholder}
            keyboardType={props.keyboardType}
            value={props.value}
            onChangeText={onChange}
            onKeyPress={catchKey}
            scrollEnabled={true} // IOS
            textAlignVertical="top" // important for Android
            className={`flex-row relative text-base self-end text-dark-gray w-full ${
              props.hideLabelOnFocus && 'text-left pr-10'
            }${!isFocused && props.hideLabelOnFocus && props.labelClassName} ${
              props.isError
                ? 'text-red-500 border-b-red-500'
                : 'border-b-opacity-gray'
            } ${props.icon && 'pl-5'}
            ${props.inputClassName}
            ${props.textRight && 'text-right'}
            ${!props.multiline && 'h-14 border-b-[1px]'}
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
        <Text className="dark-gray text-base">{props.linkText}</Text>
      </TouchableOpacity>
    </View>
  );
};
