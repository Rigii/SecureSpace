import React from 'react';
import {useReduxSelector} from '../store/store';
import {CombinedBarHome} from '../../screens/home/home';

export const PrivateRoute: React.FC<{
  navigation: any;
  redirectAuthRoute: string;
}> = ({navigation, redirectAuthRoute}) => {
  const {devicePrivateKey} = useReduxSelector(
    state => state.anonymousUserReducer.securityData?.pgpDeviceKeyData,
  );
  const {token, isOnboardingDone} = useReduxSelector(
    state => state.anonymousUserReducer.userAccountData,
  );

  React.useEffect(() => {
    if (!token) {
      navigation.navigate(redirectAuthRoute);
    }
  }, [
    devicePrivateKey,
    isOnboardingDone,
    navigation,
    redirectAuthRoute,
    token,
  ]);

  return token ? <CombinedBarHome /> : null;
};
