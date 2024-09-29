import React from 'react';
import {ScrollView} from 'react-native';
import {UserInitialData} from './onboarding-cases/user-initial-data';
import {Formik} from 'formik';
import {ImergencyPasswords} from './onboarding-cases/imergency-passwords';
import {SecurePlaces} from './onboarding-cases/secure-places';
import {WelcomeAboard} from './onboarding-cases/welcome-aboard';
import {developmentLog} from '../../services/custom-services';
import {validationOnboardingSchema} from './onboarding.validation';

export interface ISecurePlace {
  id: string;
  name: string;
  address: string;
  coordinates: {
    lat: string;
    long: string;
  };
  areaRadiusMeters: string;
}

export type TSecurePlaces = Record<string, ISecurePlace>; //{[key: string]: ISecurePlaces};

export interface IOnboardingFormValues {
  nik: string;
  sex: string;
  imergencyPasswords: string[];
  securePlaces: TSecurePlaces;
}

export const OnboardingFlow: React.FC = () => {
  const onSubmit = (values: IOnboardingFormValues) => {
    developmentLog('USER ONBOARDING DATA', values);
    /* Post data */
    /* Navigate to the main screen here (if data correct and posted) */
  };

  return (
    <Formik
      initialValues={{
        nik: '',
        sex: '',
        imergencyPasswords: [''],
        securePlaces: {},
        validationSchema: validationOnboardingSchema,
      }}
      onSubmit={onSubmit}>
      {({handleChange, setFieldValue, handleSubmit, values}) => (
        <ScrollView horizontal={true} keyboardShouldPersistTaps={'handled'}>
          <UserInitialData
            nikValue={values.nik}
            sexValue={values.sex}
            handleChange={handleChange}
            setFieldValue={setFieldValue}
          />
          <ImergencyPasswords
            imergencyPasswords={values.imergencyPasswords}
            setFieldValue={setFieldValue}
          />
          <SecurePlaces
            securePlaces={values.securePlaces}
            setFieldValue={setFieldValue}
          />
          <WelcomeAboard navigateToMain={handleSubmit} />
        </ScrollView>
      )}
    </Formik>
  );
};
