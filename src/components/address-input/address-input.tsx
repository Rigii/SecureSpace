import React from 'react';
import {View} from 'react-native';

import {
  GooglePlaceData,
  GooglePlaceDetail,
  GooglePlacesAutocomplete,
} from 'react-native-google-places-autocomplete';

export const AddressInput = ({
  placeholder,
  classNameWrapper,
  onUpdatePlaceCoordinates,
}: {
  classNameWrapper?: string;
  placeholder: string;
  onUpdatePlaceCoordinates: (
    value: GooglePlaceData,
    detail: GooglePlaceDetail | null,
  ) => Promise<void>;
}) => {
  return (
    <View className={`w-80 ${classNameWrapper}`}>
      <GooglePlacesAutocomplete
        placeholder={placeholder}
        onPress={onUpdatePlaceCoordinates}
        fetchDetails={true}
        query={{
          key: 'AIzaSyCCu1qafrPaTNoBlUreX1o2F0xkpqqP_pE',
          language: 'en',
        }}
        textInputProps={{
          placeholderTextColor: '#717170',
          padding: 0,
          paddingLeft: 0,
        }}
        styles={addressInputStyles}
      />
    </View>
  );
};

const addressInputStyles = {
  container: {
    flex: 0,
    zIndex: 1,
    background: 'inherit',
    backgroundColor: 'transparent',
    borderBottomColor: '#717170',
  },
  textInputContainer: {
    width: '100%',
    borderTopWidth: 0,
    borderBottomWidth: 1,
    borderLeftWidth: 0,
    borderRightWidth: 0,
    borderBottomColor: '#717170',
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
};
