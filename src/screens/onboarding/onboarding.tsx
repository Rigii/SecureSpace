import React, {useRef} from 'react';
import {UserInitialData} from './onboarding-cases/user-initial-data';
import {Formik} from 'formik';
import {ImergencyPasswords} from './onboarding-cases/imergency-passwords';
import {SecurePlaces} from './onboarding-cases/secure-places';
import {WelcomeAboard} from './onboarding-cases/welcome-aboard';
import {developmentLog} from '../../services/custom-services';
import {validationOnboardingSchema} from './onboarding.validation';
import Swiper from 'react-native-swiper';
import {IOnboardingFormValues, SwiperRef} from './onboarding.types';

export const OnboardingFlow: React.FC = () => {
  const swiperRef = useRef<SwiperRef>(null);
  const onSubmit = (values: IOnboardingFormValues) => {
    developmentLog('USER ONBOARDING DATA', values);
    /* Post data */
    /* Navigate to the main screen here (if data correct and posted) */
  };

  const onNextPage = () => {
    swiperRef?.current?.scrollBy(1, true);
  };

  return (
    <Formik
      initialValues={{
        name: '',
        titleForm: '',
        imergencyPasswordsEmails: [{email: '', password: ''}],
        securePlaces: {},
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
            securePlaces={values.securePlaces}
            setFieldValue={setFieldValue}
            onNextPage={onNextPage}
          />
          <WelcomeAboard navigateToMain={handleSubmit} />
        </Swiper>
      )}
    </Formik>
  );
};
