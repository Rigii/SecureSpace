import React from 'react';
import {UserInitialData} from './onboarding-cases/user-initial-data';
import {Formik} from 'formik';
import {ImergencyPasswords} from './onboarding-cases/imergency-passwords';
import {SecurePlaces} from './onboarding-cases/secure-places';
import {WelcomeAboard} from './onboarding-cases/welcome-aboard';
import {validationOnboardingSchema} from './onboarding.validation';
import Swiper from 'react-native-swiper';
import {DownloadKey} from './onboarding-cases/download-key';
import {IOnboardingFormValues} from '../../app/store/state/onboarding-state/onboarding-state.types';
import {updateFormField} from '../../app/store/state/onboarding-state/onboarding.slice';
import {FormikActions} from 'formik';
import {useOnboardingFlowState} from './onboarding.state';

export const OnboardingFlow = () => {
  const {
    isSubmitted,
    swiperRef,
    onNextPage,
    onSubmit,
    formState,
    dispatch,
    navigateToMain,
  } = useOnboardingFlowState();

  if (isSubmitted) {
    return <WelcomeAboard navigateToMain={navigateToMain} />;
  }

  return (
    <Formik
      initialValues={formState}
      validationSchema={validationOnboardingSchema}
      isInitialValid={false}
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
        const handleFieldChange =
          (field: keyof IOnboardingFormValues) => (value: string) => {
            dispatch(updateFormField({field, value}));
            setFieldValue(field, value);
          };

        const handleSetFieldValue: FormikActions<IOnboardingFormValues>['setFieldValue'] =
          (field: keyof IOnboardingFormValues, value) => {
            dispatch(updateFormField({field, value}));
            setFieldValue(field, value);
          };

        return (
          <Swiper showsPagination={false} ref={swiperRef} loop={false}>
            <UserInitialData
              nikValue={values.name}
              sexValue={values.titleForm}
              handleChange={handleFieldChange}
              setFieldValue={handleSetFieldValue}
              onNextPage={onNextPage}
              handleBlur={handleBlur}
              validateForm={validateForm}
              errors={errors}
              touched={touched}
            />
            <ImergencyPasswords
              imergencyPasswordsEmails={values.imergencyPasswordsEmails}
              setFieldValue={handleSetFieldValue}
              onNextPage={onNextPage}
              handleBlur={handleBlur}
              validateForm={validateForm}
              errors={errors}
            />
            <SecurePlaces
              securePlaceNameValue={values.securePlaceName}
              errors={errors}
              touched={touched}
              securePlaceRadiusValue={values.securePlaceRadius}
              handleChange={handleFieldChange}
              setFieldValue={handleSetFieldValue}
              onNextPage={onNextPage}
            />
            <DownloadKey
              keyPassword={values.keyPassword}
              confirmKeyPassword={values.confirmKeyPassword}
              errors={errors}
              touched={touched}
              validateForm={validateForm}
              handleChange={handleFieldChange}
              handleSubmit={handleSubmit}
            />
          </Swiper>
        );
      }}
    </Formik>
  );
};
