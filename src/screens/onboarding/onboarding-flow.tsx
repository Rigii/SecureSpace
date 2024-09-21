import React, {useState} from 'react';
import {strings} from '../../constants/strings/login-signup.strings';
import {ScrollView, View} from 'react-native';
import {Title1} from '../../components/title';
import {UserInitialData} from './onboarding-cases/user-initial-data';
import {Formik} from 'formik';
import * as Yup from 'yup';
import {ImergencyPasswords} from './onboarding-cases/imergencyPasswords';

export interface ISecurePlace {
  name: string;
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
  // const [currentIndex, setCurrentIndex] = useState(0);

  // const {width} = useWindowDimensions();
  // const SignUpSchema = Yup.object().shape({
  //   password: Yup.string()
  //     .min(2, 'Too Short!')
  //     .max(50, 'Too Long!')
  //     .required('Required'),
  //   email: Yup.string().email('Invalid email').required('Required'),
  // });

  return (
    <View className="flex flex-col content-center items-center justify-center flex-1 w-full gap-y-5">
      <Title1>{strings.secureSpace}</Title1>
      <Formik
        initialValues={{
          nik: '',
          sex: '',
          imergencyPasswords: [''],
          securePlaces: {},
        }}
        onSubmit={values => console.log(values)}>
        {({handleChange, setFieldValue, handleSubmit, values}) => (
          <ScrollView
            horizontal={true}
            // contentContainerStyle={styles.pickerContainer}
            keyboardShouldPersistTaps={'handled'}>
            <UserInitialData
              nikValue={values.nik}
              sexValue={values.sex}
              handleChange={handleChange}
              setFieldValue={setFieldValue}
            />
            ,
            <ImergencyPasswords
              imergencyPasswords={values.imergencyPasswords}
              setFieldValue={setFieldValue}
            />
            , <Places />, <Congrads />
            {/* <ThemedButton
        text={strings.login}
        disabled={false}
        theme="filled"
        onPress={handleSubmit}
        classCustomBody="w-80"
      /> */}
          </ScrollView>
        )}
      </Formik>
    </View>
  );
};
