import {useRef, useState} from 'react';
import {UserInitialData} from './onboarding-cases/user-initial-data';
import {ImergencyPasswords} from './onboarding-cases/imergency-passwords';
import {SecurePlaces} from './onboarding-cases/secure-places';
import {SwiperRef} from './onboarding.types';
import {useDispatch} from 'react-redux';
import {setUser} from '../../app/store/state/userState/userAction';
import {useReduxSelector} from '../../app/store/store';
import {DownloadKey} from './onboarding-cases/download-key';
import {IOnboardingFormValues} from '../../app/store/state/onboardingState/onboardingStateTypes';
import {followOnboardingSaga} from '../../app/store/saga/onboarding-saga/onboarding.actions';

export const useOnboardingFlowState = () => {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const swiperRef = useRef<SwiperRef>(null);
  const {userAccountData} = useReduxSelector(
    state => state.anonymousUserReducer,
  );
  const formState = useReduxSelector(state => state.onboardingFormReducer);
  const dispatch = useDispatch();

  const onSubmit = async (values: IOnboardingFormValues) => {
    dispatch(
      followOnboardingSaga({
        values,
        token: userAccountData.token,
        id: userAccountData.id,
        email: userAccountData.email,
        onSuccess: () => {
          setIsSubmitted(true);
        },
      }),
    );
  };

  const onNextPage = () => {
    swiperRef?.current?.scrollBy(1, true);
  };

  const navigateToMain = () =>
    dispatch(
      setUser({
        isOnboardingDone: true,
      }),
    );

  return {
    isSubmitted,
    swiperRef,
    formState,
    navigateToMain,
    onNextPage,
    onSubmit,
    dispatch,
    ImergencyPasswords,
    UserInitialData,
    SecurePlaces,
    DownloadKey,
  };
};
