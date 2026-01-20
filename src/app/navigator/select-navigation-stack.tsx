import React from 'react';
import {useReduxSelector} from '../store/store';
import {AuthStack} from './stack/auth-stack.navigator';
import {AppStack} from './stack/app-stack.navigator';

export const SelectNavigationStack: React.FC<{
  redirectAuthRoute: string;
}> = () => {
  // TODO: Check if device key awailable. If not, redirect to upload key screen. Notify user that data encrypted with the old key pair will be lost.
  //  const {devicePrivateKey} = useReduxSelector(
  //   state => state.anonymousUserReducer.securityData?.pgpDeviceKeyData,
  // );
  const {token, isOnboardingDone} = useReduxSelector(
    state => state.anonymousUserReducer.userAccountData,
  );

  return token && isOnboardingDone ? <AppStack /> : <AuthStack />;
};
