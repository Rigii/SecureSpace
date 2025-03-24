import React, {useContext, useRef} from 'react';
import {Formik} from 'formik';
import {
  GooglePlaceData,
  GooglePlaceDetail,
} from 'react-native-google-places-autocomplete';
import {EChatVariants} from '../../app/store/state/chatRoomsContent/chatRoomsState.types';
import {ChatNameType} from './create-chat-cases/chat-type-name';
import {ICreateRoomFormValues} from './create-update-chat.types';
import {ChatPassword} from './create-chat-cases/chat-password';
import {ChatParticipiantEmails} from './create-chat-cases/chat-participiant-emails';
import Swiper from 'react-native-swiper';
import {validationCreateChatSchema} from './create-update-chat.validation';
import {ChatLocationRestrictions} from './create-chat-cases/chat-location';
// import {generatePGPKeyPair} from '../../services/pgp-service/generate-keys';
import {ChatCheckData} from './create-chat-cases/chat-check-data';
// import {createUpdateChatRoom} from '../../services/api/chat/chat-api';
import {useReduxSelector} from '../../app/store/store';
import {ISecurePlaceData} from '../../app/types/encrypt.types';
import {ChatSocketProviderContext} from '../../services/context/chat/chat-context-provider';

export const CreateChatRoom: React.FC = () => {
  const swiperRef = useRef<React.ElementRef<typeof Swiper>>(null);
  // const {token, name} = useReduxSelector(
  //   state => state.anonymousUserReducer.userAccountData,
  // );
  const securityData = useReduxSelector(
    state => state.anonymousUserReducer.securityData,
  );
  const {interlocutorId, email} = useReduxSelector(
    state => state.userChatsReducer,
  );

  const {handleCreateChat} = useContext(ChatSocketProviderContext);

  const formState: ICreateRoomFormValues = {
    chatName: '',
    chatType: EChatVariants.private,
    participiantEmails: [],
    availabilityAreaData: {},
    availabilityAreaRadius: '1000',
    password: '',
  };

  const onSubmit = async (values: ICreateRoomFormValues) => {
    try {
      const awailabilityAreaData =
        values.availabilityAreaData as ISecurePlaceData;

      const postChatRoomData = {
        chatName: values.chatName,
        ownerId: interlocutorId,
        ownerEmail: email,
        ownerNickName: email,
        chatType: values.chatType,
        creatorPublicKeyIds: [securityData.pgpDeviceKeyData.keyUUID],
        locationAreaAvailability: awailabilityAreaData
          ? [
              {
                securePlaceData: awailabilityAreaData,
                securePlaceRadius: values.availabilityAreaRadius,
                name: 'home',
              },
            ]
          : [],
        invitedUserEmails: values.participiantEmails,
        lifeCycleLimitHours: 0,
        password: values.password,
        chatIconUrl: '',
      };

      console.log(88887777, postChatRoomData);
      handleCreateChat(postChatRoomData);
    } catch (e) {}
  };

  return (
    <Formik
      initialValues={formState}
      isInitialValid={false}
      validationSchema={validationCreateChatSchema}
      onSubmit={onSubmit}>
      {({
        setFieldValue,
        handleSubmit,
        handleBlur,
        validateForm,
        values,
        errors,
        touched,
      }) => {
        const onNextPage = () => {
          swiperRef?.current?.scrollBy(1, true);
        };

        const handleFieldChange =
          (field: keyof ICreateRoomFormValues) => (value: string) => {
            // dispatch(updateFormField({field, value}));
            setFieldValue(field, value);
          };

        const onUpdatePlaceCoordinates = async (
          value: GooglePlaceData | null,
          detail: GooglePlaceDetail | null,
        ) => {
          if (
            value === null ||
            !detail?.geometry?.location.lat ||
            !detail?.geometry?.location.lng
          ) {
            return setFieldValue('availabilityAreaData', {
              id: '',
              address: '',
              coordinates: {
                lat: '',
                long: '',
              },
            });
          }

          setFieldValue('availabilityAreaData', {
            id: detail?.geometry?.location.lat + detail?.geometry?.location.lng,
            address: value.description,
            coordinates: {
              lat: `${detail?.geometry?.location.lat}` || '',
              long: `${detail?.geometry?.location.lng}` || '',
            },
          });
        };

        return (
          <Swiper showsPagination={false} ref={swiperRef} loop={false}>
            <ChatNameType
              chatName={values.chatName}
              chatType={values.chatType}
              touched={touched}
              errors={errors}
              onNextPage={onNextPage}
              handleBlur={handleBlur}
              handleChange={handleFieldChange}
              setFieldValue={setFieldValue}
            />
            <ChatParticipiantEmails
              participiantEmails={values.participiantEmails}
              setFieldValue={setFieldValue}
              errors={errors}
              onNextPage={onNextPage}
              validateForm={validateForm}
              handleBlur={handleBlur}
            />
            <ChatPassword
              password={values.password}
              touched={touched}
              errors={errors}
              onNextPage={onNextPage}
              handleBlur={handleBlur}
              handleChange={handleFieldChange}
            />
            <ChatLocationRestrictions
              availabilityAreaRadius={values.availabilityAreaRadius}
              touched={touched}
              errors={errors}
              handleChange={handleFieldChange}
              onUpdatePlaceCoordinates={onUpdatePlaceCoordinates}
            />
            <ChatCheckData
              errors={errors}
              values={values}
              onSubmitForm={handleSubmit}
            />
          </Swiper>
        );
      }}
    </Formik>
  );
};
