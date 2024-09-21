import React, {useState} from 'react';
import {strings} from '../../../constants/strings/onboarding.strings';
import {View} from 'react-native';
import {Title1} from '../../../components/title';
import {Input, KeyboardTypes} from '../../../components/input';
import {FormikActions} from 'formik';
import {IOnboardingFormValues, ISecurePlace} from '../onboarding-flow';
import {ThemedButton} from '../../../components/themed-button';

export const UserInitialData = ({
  imergencyPasswords,
  setFieldValue,
}: {
  imergencyPasswords: string[];
  setFieldValue: FormikActions<IOnboardingFormValues>['setFieldValue'];
}) => {
  const [place, updatePlace] = useState<ISecurePlace>({
    name: '',
    coordinates: {
      lat: '',
      long: '',
    },
    areaRadiusMetters: '',
  });

  const onUpdatePlaceName = (name: string) => {
    updatePlace(state => ({...state, name}));
  };

  const onUpdatePlaceCoordinates = (latitude: string, longtitude: string) => {
    const currentLatitude =
      latitude.length > 0 ? latitude : place.coordinates.lat;
    const currentLongtitude =
      longtitude.length > 0 ? longtitude : place.coordinates.long;

    updatePlace(state => ({...state, coordinates: {lat: latitude, long: longtitude}}));
  };

  return (
    <View>
      <Title1>{strings.accountData}</Title1>
      <Input
        // isError={!!errors.email && touched.email}
        value={item}
        onChange={(value: string) => updatePasswordAtIndex(index, value)}
        name="securePlace"
        placeholder={strings.passwordPlaceholder}
        keyboardType={KeyboardTypes.default}
        className="w-80"
        key={index}
      />

      <ThemedButton
        text={strings.savePasswords}
        disabled={passwordArray[0].length > 3}
        theme="filled"
        onPress={onSavePlaces}
        classCustomBody="w-80"
      />
    </View>
  );
};
