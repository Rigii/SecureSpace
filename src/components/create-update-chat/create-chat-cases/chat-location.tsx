import React from 'react';
import {Title1, Title2} from '../../title';
import {View} from 'react-native';
import {Input, KeyboardTypes} from '../../input';
import {ThemedButton} from '../../themed-button';
import {FormikErrors, FormikTouched} from 'formik';
import {strings} from '../create-chat-form.strings';
import {ICreateRoomFormValues} from '../create-update-chat.types';
import {AddressInput} from '../../address-input/address-input';
import {
  GooglePlaceData,
  GooglePlaceDetail,
} from 'react-native-google-places-autocomplete';

export const ChatLocationRestrictions: React.FC<{
  availabilityAreaRadius: string;
  touched: FormikTouched<ICreateRoomFormValues>;
  errors: FormikErrors<ICreateRoomFormValues>;
  onUpdatePlaceCoordinates: (
    value: GooglePlaceData | null,
    detail: GooglePlaceDetail | null,
  ) => Promise<void>;
  handleChange: (field: keyof ICreateRoomFormValues) => (value: string) => void;
}> = ({
  availabilityAreaRadius,
  touched,
  errors,
  handleChange,
  onUpdatePlaceCoordinates,
}) => {
  return (
    <View className="flex flex-col items-center flex-1 p-3 w-screen	relative">
      <View className="block flex-1 m-auto items-center justify-center gap-y-5">
        <Title1 className="break-words">{strings.newChatroom}</Title1>
        <Title2 className="break-words">{`${strings.locationRestrictions} (${strings.optional})`}</Title2>
        <View>
          <AddressInput
            isError={!!errors.availabilityAreaData}
            placeholder={strings.address}
            onUpdatePlaceCoordinates={onUpdatePlaceCoordinates}
          />
        </View>
        <Input
          isError={
            touched.availabilityAreaRadius && !!errors.availabilityAreaRadius
          }
          value={availabilityAreaRadius}
          onChange={handleChange('availabilityAreaRadius')}
          placeholder={'Radius'}
          keyboardType={KeyboardTypes.default}
          className="w-80"
          isNumeric={true}
        />
      </View>
      <ThemedButton
        text={strings.next}
        disabled={!!errors.availabilityAreaData}
        theme="filled"
        onPress={() => null}
        classCustomBody="w-80"
      />
    </View>
  );
};
