import {createAction} from '@reduxjs/toolkit';
import {IOnboardingFormValues} from '../../state/onboarding-state/onboarding-state.types';

export const followOnboardingSaga = createAction<{
  values: IOnboardingFormValues;
  email: string;
  id: string;
  token: string;
  onSuccess: () => void;
}>('onboarding/followOnboardingRequested');

export const followOnboardingSuccess = createAction(
  'onboarding/followOnboardingSuccess',
);

export const followOnboardingFailed = createAction<string>(
  'onboarding/followOnboardingFailed',
);
