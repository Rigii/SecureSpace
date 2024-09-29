import React, {useState} from 'react';
import {strings} from '../../../constants/strings/onboarding.strings';
import {View} from 'react-native';
import {Title1} from '../../../components/title';
import {Input, KeyboardTypes} from '../../../components/input';
import {FormikActions} from 'formik';
import {
  IOnboardingFormValues,
  ISecurePlace,
  TSecurePlaces,
} from '../onboarding-flow';
import {ThemedButton} from '../../../components/themed-button';
import {
  GooglePlaceData,
  GooglePlaceDetail,
} from 'react-native-google-places-autocomplete';
import {AddressInput} from '../../../components/address-input/address-input';

export const SecurePlaces = ({
  securePlaces,
  setFieldValue,
}: {
  securePlaces: TSecurePlaces;
  setFieldValue: FormikActions<IOnboardingFormValues>['setFieldValue'];
}) => {
  const [place, updatePlace] = useState<ISecurePlace>({
    id: '',
    name: '',
    address: '',
    coordinates: {
      lat: '',
      long: '',
    },
    areaRadiusMeters: '',
  });

  // const placesArray = Object.values(securePlaces);
  const onUpdatePlaceName = (value: string) => {
    updatePlace(state => ({...state, name: value}));
  };

  const onUpdatePlaceCoordinates = async (
    value: GooglePlaceData,
    detail: GooglePlaceDetail | null,
  ) => {
    updatePlace(state => ({...state, address: value.description}));

    updatePlace(state => ({
      ...state,
      coordinates: {
        lat: `${detail?.geometry?.location.lat}` || '',
        long: `${detail?.geometry?.location.lng}` || '',
      },
    }));
  };

  const onSetRadius = (areaRadiusMeters: string) => {
    updatePlace(state => ({...state, areaRadiusMeters}));
  };

  const onAddPlaceValue = () => {
    const currentPlaceId = place.coordinates.lat + place.coordinates.long;
    setFieldValue('securePlaces', {...place, id: currentPlaceId});
  };

  return (
    <View className="flex flex-col items-center flex-1 p-3 w-screen">
      <Title1>{strings.accountData}</Title1>
      <View className="block flex-1 m-auto items-center justify-center gap-y-5 overflow-scroll">
        <Title1>{strings.securePlace}</Title1>
        <View>
          <AddressInput
            placeholder={strings.address}
            onUpdatePlaceCoordinates={onUpdatePlaceCoordinates}
          />
          <Input
            // isError={!!errors.email && touched.email}
            value={place.name}
            onChange={onUpdatePlaceName}
            name="name"
            placeholder={strings.placeName}
            keyboardType={KeyboardTypes.default}
            className="w-80"
          />
          <Input
            // isError={!!errors.email && touched.email}
            value={place.areaRadiusMeters}
            onChange={onSetRadius}
            name="radius"
            placeholder={strings.radius}
            keyboardType={KeyboardTypes.default}
            className="w-80"
            isNumeric={true}
          />
        </View>
      </View>
      <ThemedButton
        text={strings.savePlace}
        disabled={!place.name || !place.coordinates.lat}
        theme="filled"
        onPress={onAddPlaceValue}
        classCustomBody="w-80"
      />
    </View>
  );
};
