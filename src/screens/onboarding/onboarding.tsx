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
import {Platform} from 'react-native';
import {generateDeviceDataKeyFile} from '../../services/pgp-service/create-key-file';
import {DownloadKey} from './onboarding-cases/download-key';

export const OnboardingFlow = () => {
  const [isSubmitted, setIsSubmitted] = useState(false);

  const swiperRef = useRef<SwiperRef>(null);
  const {userAccountData, securityData} = useReduxSelector(
    state => state.anonymousUserReducer,
  );

  const dispatch = useDispatch();
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  const saveKeyOnDevice = async ({
    email,
    password,
    keyUUID,
    devicePrivateKey,
  }: {
    email: string;
    password: string;
    keyUUID: string;
    devicePrivateKey: string;
  }) => {
    await generateDeviceDataKeyFile({
      email,
      uuid: keyUUID,
      privateKey: devicePrivateKey,
      sertificateDataPassword: password,
    });
  };

  const onSubmit = async (values: IOnboardingFormValues) => {
    const userKeys = await generatePGPKeyPair({
      userIds: [{name: values.name, email: userAccountData.email}],
      numBits: 2048,
      passphrase: values.keyPassword,
    });

    const publicKeyData = {
      publicKey: userKeys.publicKey,
      os: Platform.OS,
      date: getTime(new Date()),
      email: userAccountData.email,
      approved: true,
    };

    try {
      const response = await postOnboardingDataApi(userAccountData.token, {
        role: 'user', // TODO: get from the global constants
        title: values.titleForm,
        isOnboardingDone: true,
        name: values.name,
        accessCredentials: values.imergencyPasswordsEmails,
        accountId: userAccountData.id,
        pgpPublicKey: publicKeyData,
        securePlaces: [
          {
            name: values.securePlaceName,
            securePlaceData: values.securePlaceData,
            securePlaceRadius: values.securePlaceRadius,
          },
        ],
      });

      if (!response.data?.newPublicKeysData?.id) {
        throw new Error('PGP Key id is not awailable');
      }

      console.log(77777777777, response.data?.newPublicKeysData?.id);

      if (values.saveKeyOnDevice) {
        await saveKeyOnDevice({
          email: userAccountData.email,
          password: values.keyPassword,
          keyUUID: response.data?.newPublicKeysData?.id,
          devicePrivateKey: userKeys.privateKey,
        });
      }

      const pgpDeviceKeyData = {
        devicePrivateKey: userKeys.privateKey,
        date: getTime(new Date()),
        email: userAccountData.email,
        keyUUID: response.data?.newPublicKeysData?.id,
        approved: true,
      };

      console.log(33333333333, pgpDeviceKeyData);

      const deviceIdentifyer = {
        os: Platform.OS,
        date: getTime(new Date()),
      };

      dispatch(
        setUser({
          title: values.titleForm,
          name: values.name,
        }),
        setSecurityData({
          accessCredentials: values.imergencyPasswordsEmails,
          deviceIdentifyer,
          pgpDeviceKeyData,
          securePlaces: [
            {
              name: values.securePlaceName,
              securePlaceData: values.securePlaceData,
              securePlaceRadius: values.securePlaceRadius,
            },
          ],
        }),
      );

      setIsSubmitted(true);
    } catch (error) {
      const currentError = error as Error;

      ErrorNotificationHandler({
        type: EPopupType.ERROR,
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
        keyPassword: '',
        confirmKeyPassword: '',
        saveKeyOnDevice: false,
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
            setFieldValue={setFieldValue}
            onNextPage={onNextPage}
          />
          <DownloadKey
            keyPassword={values.keyPassword}
            confirmKeyPassword={values.confirmKeyPassword}
            errors={errors}
            touched={touched}
            validateForm={validateForm}
            handleChange={handleChange}
            handleSubmit={handleSubmit}
          />
        </Swiper>
      )}
    </Formik>
  );
};
