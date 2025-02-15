import * as Yup from 'yup';

export const validationOnboardingSchema = Yup.object().shape({
  name: Yup.string()
    .min(2, 'Too Short!')
    .max(50, 'Too Long!')
    .required('Let us know how to call you'),
  titleForm: Yup.string().required('Add your titleForm'),
  imergencyPasswordsEmails: Yup.array()
    .min(1, 'At least 1 emergency passwords are required')
    .required('Emergency passwords are required'),
  securePlaceName: Yup.string().test(
    'securePlaceData-address-filled',
    'securePlaceName is invalid because securePlaceData.address is filled',
    function (value) {
      const {securePlaceData} = this.parent;
      if (securePlaceData?.address) {
        return !!value;
      }

      return true;
    },
  ),
  securePlaceData: Yup.object().shape({
    id: Yup.string(),
    address: Yup.string(),
    coordinates: Yup.object().shape({
      lat: Yup.string().required('Latitude is required'),
      long: Yup.string(),
    }),
  }),
  keyPassword: Yup.string().test(
    'is-greater-than-five-and-less-than-twenty',
    'Value must be greater than 5 and less than 20',
    value => {
      if (!value) return true;
      return value?.length > 5 && value.length < 20;
    },
  ),
  confirmKeyPassword: Yup.string().test(
    'securePlaceData-address-filled',
    'securePlaceName is invalid because securePlaceData.address is filled',
    function (value) {
      const {keyPassword} = this.parent;
      if (!keyPassword) {
        return true;
      }
      return keyPassword === value;
    },
  ),
  // .oneOf(
  //   [Yup.ref('keyPassword')],
  //   'Passwords must match',
  // ),
});
