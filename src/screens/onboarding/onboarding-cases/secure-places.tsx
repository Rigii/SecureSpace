import React from 'react';
import {strings} from '../../../constants/strings/onboarding.strings';
import {Keyboard, TouchableWithoutFeedback, View} from 'react-native';
import {Title1} from '../../../components/title';
import {Input, KeyboardTypes} from '../../../components/input';
import {
  FormikActions,
  FormikHandlers,
  FormikErrors,
  FormikTouched,
} from 'formik';

import {ThemedButton} from '../../../components/themed-button';
import {
  GooglePlaceData,
  GooglePlaceDetail,
} from 'react-native-google-places-autocomplete';
import {AddressInput} from '../../../components/address-input/address-input';
import {IOnboardingFormValues} from '../onboarding.types';

export const SecurePlaces = ({
  securePlaceNameValue,
  securePlaceRadiusValue,
  errors,
  touched,
  validateForm,
  handleChange,
  setFieldValue,
  onNextPage,
  handleSubmit,
}: {
  securePlaceNameValue: string;
  securePlaceRadiusValue: string;
  errors: FormikErrors<IOnboardingFormValues>;
  touched: FormikTouched<IOnboardingFormValues>;
  validateForm: (values?: any) => Promise<FormikErrors<IOnboardingFormValues>>;
  handleSubmit: (e?: React.FormEvent<HTMLFormElement> | undefined) => void;
  handleChange: FormikHandlers['handleChange'];
  setFieldValue: FormikActions<IOnboardingFormValues>['setFieldValue'];
  onNextPage: () => void;
}) => {
  const onUpdatePlaceCoordinates = async (
    value: GooglePlaceData,
    detail: GooglePlaceDetail | null,
  ) => {
    if (!detail?.geometry?.location.lat || !detail?.geometry?.location.lng) {
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

  const onAddPlaceValue = async () => {
    const errors = await validateForm();
    if (Object.keys(errors).length > 0) {
      console.log(22222, errors);
    }
    handleSubmit();
    // onNextPage();
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
          // disabled={!place.name || !place.coordinates.lat}
          theme="filled"
          onPress={onAddPlaceValue}
          classCustomBody="w-80"
        />
      </View>
    </TouchableWithoutFeedback>
  );
};
