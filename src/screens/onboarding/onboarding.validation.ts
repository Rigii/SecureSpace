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
      const {securePlaceData} = this.parent; // Access the parent object
      // Check if securePlaceData.address exists and is not empty
      if (securePlaceData?.address) {
        // Return true if securePlaceName is valid; otherwise, it's invalid
        return !!value;
      }
      // If address is empty, no error should occur for securePlaceName
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
  keyPassword: Yup.string()
    .min(6, 'Too Short!')
    .max(12, 'Too Long!')
    .required('The passwod should have at least 6 symbols'),
  confirmKeyPassword: Yup.string()
    .min(6, 'Too Short!')
    .max(12, 'Too Long!')
    .required('The passwod should have at least 6 symbols')
    .oneOf([Yup.ref('keyPassword')], 'Passwords must match'),
});
