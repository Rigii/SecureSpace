import * as Yup from 'yup';

export const validationCreateChatSchema = Yup.object().shape({
  chatName: Yup.string()
    .min(2, 'Too Short!')
    .max(50, 'Too Long!')
    .required('Let us know how to call you'),
  chatType: Yup.string().required('Add Chat Type'),
  participiantEmails: Yup.array()
    .min(1, 'At least 1 participiant required')
    .required('Participiant are required'),
  availabilityAreaData: Yup.object().shape({
    id: Yup.string(),
    address: Yup.string(),
    coordinates: Yup.object().shape({
      lat: Yup.string().required('Latitude is required'),
      long: Yup.string(),
    }),
  }),
  password: Yup.string().test(
    'is-greater-than-five-and-less-than-twenty',
    'Value must be greater than 5 and less than 20',
    value => {
      if (!value) return true;
      return value?.length > 5 && value.length < 20;
    },
  ),
  // .oneOf(
  //   [Yup.ref('keyPassword')],
  //   'Passwords must match',
  // ),
});
