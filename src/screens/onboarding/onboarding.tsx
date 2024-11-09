import React, {useRef, useState} from 'react';
import {UserInitialData} from './onboarding-cases/user-initial-data';
import {Formik} from 'formik';
import {ImergencyPasswords} from './onboarding-cases/imergency-passwords';
import {SecurePlaces} from './onboarding-cases/secure-places';
import {WelcomeAboard} from './onboarding-cases/welcome-aboard';
import {validationOnboardingSchema} from './onboarding.validation';
import Swiper from 'react-native-swiper';
import {IOnboardingFormValues, SwiperRef} from './onboarding.types';
import {useDispatch} from 'react-redux';
import {setOnboardingData} from '../../app/store/state/userState/userAction';
import {
  RootStackParamList,
  manualEncryptionScreenRoutes,
} from '../../app/navigator/screens';
import {NavigationProp, useNavigation} from '@react-navigation/native';

export const OnboardingFlow = () => {
  const [isSubmitted, setIsSubmitted] = useState(false);

  const swiperRef = useRef<SwiperRef>(null);

  const dispatch = useDispatch();
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  const onSubmit = (values: IOnboardingFormValues) => {
    const secureOption = {
      imergencyPasswordsEmails: values.imergencyPasswordsEmails,
      securePlaces: {
        [values.securePlaceName]: {
          ...values.securePlaceData,
          name: values.securePlaceName,
          securePlaceRadius: values.securePlaceRadius,
        },
      },
    };

    dispatch(
      setOnboardingData({
        secureOptions: secureOption,
        displayName: values.name,
      }),
    );

    /* Post data */
    setIsSubmitted(true);
  };

  const onNextPage = () => {
    swiperRef?.current?.scrollBy(1, true);
  };

  if (isSubmitted) {
    return (
      <WelcomeAboard
        navigateToMain={() =>
          navigation.navigate(manualEncryptionScreenRoutes.home)
        }
      />
    );
  }

  return (
    <Formik
      initialValues={{
        name: '',
        titleForm: '',
        imergencyPasswordsEmails: [{email: '', password: ''}],
        securePlaceName: '',
        securePlaceData: {
          id: '',
          address: '',
          coordinates: {
            lat: '',
            long: '',
          },
        },
        securePlaceRadius: '',
      }}
      validationSchema={validationOnboardingSchema}
      isInitialValid={false}
      onSubmit={onSubmit}>
      {({
        handleChange,
        setFieldValue,
        handleSubmit,
        handleBlur,
        validateForm,
        values,
        errors,
        touched,
      }) => (
        <Swiper showsPagination={false} ref={swiperRef} loop={false}>
          <UserInitialData
            nikValue={values.name}
            sexValue={values.titleForm}
            handleChange={handleChange}
            setFieldValue={setFieldValue}
            onNextPage={onNextPage}
            handleBlur={handleBlur}
            validateForm={validateForm}
            errors={errors}
            touched={touched}
          />
          <ImergencyPasswords
            imergencyPasswordsEmails={values.imergencyPasswordsEmails}
            setFieldValue={setFieldValue}
            onNextPage={onNextPage}
            handleBlur={handleBlur}
            validateForm={validateForm}
            handleChange={handleChange}
            errors={errors}
          />
          <SecurePlaces
            securePlaceNameValue={values.securePlaceName}
            errors={errors}
            touched={touched}
            securePlaceRadiusValue={values.securePlaceRadius}
            handleChange={handleChange}
            validateForm={validateForm}
            handleSubmit={handleSubmit}
            setFieldValue={setFieldValue}
            onNextPage={onNextPage}
          />
        </Swiper>
      )}
    </Formik>
  );
};
