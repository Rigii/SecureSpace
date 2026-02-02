import React from 'react';
import {useReduxSelector} from '../store/store';
import {AuthStack} from './stack/auth-stack.navigator';
import {AppStack} from './stack/app-stack.navigator';

export const SelectNavigationStack: React.FC<{
  redirectAuthRoute: string;
}> = () => {
  const {token, isOnboardingDone} = useReduxSelector(
    state => state.anonymousUserReducer.userAccountData,
  );

  return token && isOnboardingDone ? <AppStack /> : <AuthStack />;
};
