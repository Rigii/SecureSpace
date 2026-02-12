import {PayloadAction, createSlice} from '@reduxjs/toolkit';
import {IOnboardingFormValues} from './onboarding-state.types';

const initialState: IOnboardingFormValues = {
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
};

const onboardingFormSlice = createSlice({
  name: 'onboardingForm',
  initialState,
  reducers: {
    updateFormField: <K extends keyof IOnboardingFormValues>(
      state: IOnboardingFormValues,
      action: PayloadAction<{field: K; value: IOnboardingFormValues[K]}>,
    ) => {
      const {field, value} = action.payload;
      state[field] = value;
    },
    resetForm: state => {
      Object.assign(state, initialState);
    },
  },
});

export const {updateFormField, resetForm} = onboardingFormSlice.actions;
export default onboardingFormSlice.reducer;
