import {GOOGLE_API_KEY} from '@env';
import React, {useCallback, useState} from 'react';
import {ThemedButton} from '../themed-button';
import {Title3} from '../text-titles/title';
import {ISecurePlaceData} from '../../app/types/encrypt.types';

import {View} from 'react-native';

import {
  GooglePlaceData,
  GooglePlaceDetail,
  GooglePlacesAutocomplete,
} from 'react-native-google-places-autocomplete';

const strings = {
  next: 'Add',
  address: 'Selected Address (area center): ',
};

export const AddressInput = ({
  availabilityAreaData,
  placeholder,
  classNameWrapper,
  onUpdatePlaceCoordinates,
}: {
  availabilityAreaData: {} | ISecurePlaceData;
  classNameWrapper?: string;
  placeholder: string;
  onUpdatePlaceCoordinates: (
    value: GooglePlaceData | null,
    detail: GooglePlaceDetail | null,
  ) => Promise<void>;
}) => {
  const [placeText, setPlaceText] = useState('');
  const [placeCoordinates, setPlaceCoordinates] = useState<{
    data: GooglePlaceData | null;
    detail: GooglePlaceDetail | null;
  } | null>(null);

  const onChangeText = useCallback(
    (text: string) => {
      if (text.length < 1 && placeText.length > 0) {
        setPlaceText('');
        setPlaceCoordinates(null);
        onUpdatePlaceCoordinates(null, null);
        return;
      }

      setPlaceText(text);
    },
    [onUpdatePlaceCoordinates, placeText.length],
  );

  const onUpdateCoordinatesLocal = (
    data: GooglePlaceData | null,
    details: GooglePlaceDetail | null = null,
  ) => setPlaceCoordinates({data, detail: details});

  const onUpdateCoordinates = () =>
    onUpdatePlaceCoordinates(
      placeCoordinates?.data || null,
      placeCoordinates?.detail || null,
    );

  const isShowError = placeText.length > 0 && !placeCoordinates;

  return (
    <View className="flex flex-col items-center relative">
      <Title3 className="break-words mb-6">
        {`${strings.address} ${
          availabilityAreaData?.hasOwnProperty('address')
            ? (availabilityAreaData as ISecurePlaceData).address
            : ''
        }`}
      </Title3>

      <View className={`w-80 flex flex-row ${classNameWrapper}`}>
        <View className="flex-1">
          <GooglePlacesAutocomplete
            placeholder={placeholder}
            onPress={onUpdateCoordinatesLocal}
            fetchDetails={true}
            query={{
              key: GOOGLE_API_KEY,
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
        <ThemedButton
          text={strings.next}
          disabled={!placeCoordinates}
          theme="filled"
          onPress={onUpdateCoordinates}
          classCustomBody="w-20 left-3"
        />
      </View>
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
    backgroundColor: 'transparent',
    color: '#717170',
  },
  description: {
    color: '#717170',
  },
});
