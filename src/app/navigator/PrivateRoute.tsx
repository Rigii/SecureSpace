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
  if (isAuthenticated) {
    return <Component />;
  } else {
    navigation.navigate(redirectAuthRoute);
    return null;
  }
};
