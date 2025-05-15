import React from 'react';
import {useReduxSelector} from '../store/store';
import {CombinedBarHome} from '../../screens/home/home';
import {manualEncryptionScreenRoutes} from './screens';

export const PrivateRoute: React.FC<{
  navigation: any;
  redirectAuthRoute: string;
}> = ({navigation, redirectAuthRoute}) => {
  const {devicePrivateKey} = useReduxSelector(
    state => state.anonymousUserReducer.securityData?.pgpDeviceKeyData,
  );
  const {token} = useReduxSelector(
    state => state.anonymousUserReducer.userAccountData,
  );

  // const component = devicePrivateKey ? <CombinedBarHome /> : <UploadKey />;

  React.useEffect(() => {
    if (!token) {
      navigation.navigate(redirectAuthRoute);
    }

    if (token && !devicePrivateKey) {
      navigation.navigate(manualEncryptionScreenRoutes.uploadKey);
    }
  }, [devicePrivateKey, navigation, redirectAuthRoute, token]);

  return token ? <CombinedBarHome /> : null;
};
