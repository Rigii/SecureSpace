import React from 'react';

export const PrivateRoute: React.FC<{
  isAuthenticated: boolean;
  navigation: any;
  redirectAuthRoute: string;
  component: React.FC;
}> = ({
  isAuthenticated,
  navigation,
  redirectAuthRoute,
  component: Component,
}) => {
  React.useEffect(() => {
    if (!isAuthenticated) {
      navigation.navigate(redirectAuthRoute);
    }
  }, [isAuthenticated, navigation, redirectAuthRoute]);

  return isAuthenticated ? <Component /> : null;
};
