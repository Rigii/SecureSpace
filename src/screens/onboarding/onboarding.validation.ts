import * as Yup from 'yup';

export const validationOnboardingSchema = Yup.object().shape({
  nik: Yup.string()
    .min(2, 'Too Short!')
    .max(50, 'Too Long!')
    .required('Let us know how to call you'),
  sex: Yup.string().required('Add your sex'),
  imergencyPasswords: Yup.array()
    .of(Yup.string())
    .min(3, 'At least 3 emergency passwords are required')
    .required('Emergency passwords are required'),
  securePlaces: Yup.object()
    .test('not-empty', 'securePlaces must not be empty', value => {
      return value && Object.keys(value).length > 0;
    })
    .required('Add at least one secure place'),
});
