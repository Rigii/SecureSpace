import React from 'react';
import {strings} from '../../../constants/strings/onboarding.strings';
import {Keyboard, TouchableWithoutFeedback, View} from 'react-native';
import {Title1} from '../../../components/text-titles/title';
import {Input, KeyboardTypes} from '../../../components/input';
import {FormikActions, FormikErrors, FormikTouched} from 'formik';

import {ThemedButton} from '../../../components/themed-button';
import {
  GooglePlaceData,
  GooglePlaceDetail,
} from 'react-native-google-places-autocomplete';
import {AddressInput} from '../../../components/address-input/address-input';
import {IOnboardingFormValues} from '../../../app/store/state/onboarding-state/onboarding-state.types';

export const SecurePlaces = ({
  securePlaceNameValue,
  securePlaceRadiusValue,
  errors,
  touched,
  handleChange,
  setFieldValue,
  onNextPage,
}: {
  securePlaceNameValue: string;
  securePlaceRadiusValue: string;
  errors: FormikErrors<IOnboardingFormValues>;
  touched: FormikTouched<IOnboardingFormValues>;
  handleChange: (field: keyof IOnboardingFormValues) => (value: string) => void;
  setFieldValue: FormikActions<IOnboardingFormValues>['setFieldValue'];
  onNextPage: () => void;
}) => {
  const onUpdatePlaceCoordinates = async (
    value: GooglePlaceData | null,
    detail: GooglePlaceDetail | null,
  ) => {
    if (
      value === null ||
      !detail?.geometry?.location.lat ||
      !detail?.geometry?.location.lng
    ) {
      return setFieldValue('securePlaceData', {
        id: '',
        address: '',
        coordinates: {
          lat: '',
          long: '',
        },
      });
    }
    setFieldValue('securePlaceData', {
      id: detail?.geometry?.location.lat + detail?.geometry?.location.lng,
      address: value.description,
      coordinates: {
        lat: `${detail?.geometry?.location.lat}` || '',
        long: `${detail?.geometry?.location.lng}` || '',
      },
    });
  };

  const handleScreenPress = () => {
    Keyboard.dismiss();
  };

  return (
    <TouchableWithoutFeedback onPress={handleScreenPress}>
      <View className="flex flex-col items-center flex-1 p-3 w-screen">
        <View className="block flex-1 m-auto items-center justify-center gap-y-5 overflow-scroll">
          <Title1>{strings.securePlace}</Title1>
          <View>
            <AddressInput
              isError={!!errors.securePlaceData}
              placeholder={strings.address}
              onUpdatePlaceCoordinates={onUpdatePlaceCoordinates}
            />
            <Input
              isError={!!errors.securePlaceName}
              value={securePlaceNameValue}
              onChange={handleChange('securePlaceName')}
              placeholder={strings.placeName}
              keyboardType={KeyboardTypes.default}
              className="w-80"
            />
            <Input
              isError={touched.securePlaceRadius && !!errors.securePlaceRadius}
              value={securePlaceRadiusValue}
              onChange={handleChange('securePlaceRadius')}
              placeholder={strings.radius}
              keyboardType={KeyboardTypes.default}
              className="w-80"
              isNumeric={true}
            />
          </View>
        </View>
        <ThemedButton
          text={strings.savePlace}
          disabled={!!errors.securePlaceData || !!errors.securePlaceName}
          theme="filled"
          onPress={onNextPage}
          classCustomBody="w-80"
        />
      </View>
    </TouchableWithoutFeedback>
  );
};
