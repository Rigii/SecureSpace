import React, {useCallback, useState} from 'react';
import {View} from 'react-native';

import {
  GooglePlaceData,
  GooglePlaceDetail,
  GooglePlacesAutocomplete,
} from 'react-native-google-places-autocomplete';

export const AddressInput = ({
  placeholder,
  classNameWrapper,
  isError,
  onUpdatePlaceCoordinates,
}: {
  classNameWrapper?: string;
  placeholder: string;
  isError?: boolean;
  onUpdatePlaceCoordinates: (
    value: GooglePlaceData | null,
    detail: GooglePlaceDetail | null,
  ) => Promise<void>;
}) => {
  const [placeText, setPlaceText] = useState('');

  const onChangeText = useCallback(
    (text: string) => {
      if (text.length < 1 && placeText.length > 0) {
        setPlaceText('');
        onUpdatePlaceCoordinates(null, null);
        return;
      }

      setPlaceText(text);
    },
    [onUpdatePlaceCoordinates, placeText.length],
  );

  const isShowError = isError && placeText.length > 0;

  return (
    <View className={`w-80 ${classNameWrapper}`}>
      <GooglePlacesAutocomplete
        placeholder={placeholder}
        onPress={onUpdatePlaceCoordinates}
        fetchDetails={true}
        query={{
          key: 'AIzaSyCCu1qafrPaTNoBlUreX1o2F0xkpqqP_pE', // TODO: KEY To secrets
          language: 'en',
        }}
        textInputProps={{
          onChangeText: onChangeText,
          placeholderTextColor: isShowError ? '#FF0000' : '#717170',
          padding: 0,
          paddingLeft: 0,
        }}
        styles={addressInputStyles(isShowError)}
      />
    </View>
  );
};

const addressInputStyles = (isError?: boolean) => ({
  container: {
    flex: 0,
    zIndex: 1,
    background: 'inherit',
    backgroundColor: 'transparent',
  },
  textInputContainer: {
    width: '100%',
    borderTopWidth: 0,
    borderBottomWidth: 1,
    borderLeftWidth: 0,
    borderRightWidth: 0,
    borderBottomColor: isError ? '#FF0000' : '#717170',
    background: 'inherit',
    backgroundColor: 'transparent',
  },
  textInput: {
    height: 40,
    paddingHorizontal: 16,
    borderWidth: 0,
    background: 'inherit',
    backgroundColor: 'transparent',
    color: '#717170',
  },
  description: {
    color: '#717170',
  },
});
