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
import {
  setSecurityData,
  setUser,
} from '../../app/store/state/userState/userAction';
import {
  RootStackParamList,
  manualEncryptionScreenRoutes,
} from '../../app/navigator/screens';
import {NavigationProp, useNavigation} from '@react-navigation/native';
import {postOnboardingDataApi} from '../../services/api/user/user.api';
import {useReduxSelector} from '../../app/store/store';
import {
  EPopupType,
  ErrorNotificationHandler,
} from '../../services/ErrorNotificationHandler';
import {generatePGPKeyPair} from '../../services/pgp-service/generate-keys';
import {getTime} from 'date-fns';
import uuidv4 from 'react-native-uuid';
import {Platform} from 'react-native';

export const OnboardingFlow = () => {
  const [isSubmitted, setIsSubmitted] = useState(false);

  const swiperRef = useRef<SwiperRef>(null);
  const {userAccountData} = useReduxSelector(
    state => state.anonymousUserReducer,
  );

  const dispatch = useDispatch();
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  const onSubmit = async (values: IOnboardingFormValues) => {
    const generatedId = uuidv4.v4();

    console.log(8888888, values);

    const userKeys = await generatePGPKeyPair({
      userIds: [{name: 'Bill', email: 'Geits'}],
      numBits: 2048,
      passphrase: '',
    });

    const publicKeyData = {
      publicKey: userKeys.publicKey,
      os: Platform.OS,
      date: getTime(new Date()),
      deviceUuid: generatedId as string,
      email: userAccountData.email,
      approved: true,
    };

    const deviceKeyData = {
      devicePrivateKey: userKeys.privateKey,
      date: getTime(new Date()),
      email: userAccountData.email,
      approved: true,
    };

    try {
      await postOnboardingDataApi(userAccountData.token, {
        role: 'user', // TODO: get from the global constants
        title: values.titleForm,
        isOnboardingDone: true,
        name: values.name,
        accountSecret: '123',
        destroyAccountSecret: '321',
        accessCredentials: values.imergencyPasswordsEmails,
        accountId: userAccountData.id,
        pgpPublicKey: publicKeyData,
        deviceIdentifyer: generatedId,
        securePlaces: [
          {
            name: values.securePlaceName,
            securePlaceData: values.securePlaceData,
            securePlaceRadius: values.securePlaceRadius,
          },
        ],
      });

      dispatch(
        setUser({
          title: values.titleForm,
          name: values.name,
        }),
        setSecurityData({
          accessCredentials: values.imergencyPasswordsEmails,
          deviceIdentifyer: {
            os: Platform.OS,
            deviceUuid: generatedId as string,
            date: getTime(new Date()),
          },
          pgpDeviceKeyData: deviceKeyData,
          securePlaces: [
            {
              name: values.securePlaceName,
              securePlaceData: values.securePlaceData,
              securePlaceRadius: values.securePlaceRadius,
            },
          ],
        }),
      );

      // setIsSubmitted(true);
    } catch (error) {
      const currentError = error as Error;

      ErrorNotificationHandler({
        type: EPopupType.WARNING,
        text1: 'Onboarding data submit error',
        text2: currentError.name || '',
      });
    }
  };

  const onNextPage = () => {
    swiperRef?.current?.scrollBy(1, true);
  };

  if (isSubmitted) {
    return (
      <WelcomeAboard
        navigateToMain={() =>
          navigation.navigate(manualEncryptionScreenRoutes.root)
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
