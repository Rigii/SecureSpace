import {NavigationContainerRef, StackActions} from '@react-navigation/native';
import {RefObject} from 'react';
import {
  RootStackParamList,
  TapplicationScreens,
} from '../../app/navigator/screens';

type NavigateFunction = <RouteName extends TapplicationScreens>(
  name: RouteName,
  params?: RootStackParamList[RouteName],
) => void;

export const createNavigationActions = (
  navigationRef: RefObject<NavigationContainerRef<RootStackParamList>>,
) => {
  const navigate: NavigateFunction = (name, params) => {
    if (navigationRef.current) {
      (navigationRef.current.navigate as any)(name, params);
    }
  };

  const goBack = () => {
    if (navigationRef.current) {
      navigationRef.current.goBack();
    }
  };

  const reset = (
    name: TapplicationScreens,
    params?: RootStackParamList[TapplicationScreens],
  ) => {
    if (navigationRef.current) {
      navigationRef.current.reset({
        index: 0,
        routes: [{name, params} as any],
      });
    }
  };

  const replace = <RouteName extends TapplicationScreens>(
    name: RouteName,
    params?: RootStackParamList[RouteName],
  ) => {
    if (navigationRef.current) {
      navigationRef.current.reset({
        index: 0,
        routes: [{name, params} as any],
      });
    }
  };

  const popToTop = () => {
    if (navigationRef.current) {
      navigationRef.current.dispatch(StackActions.popToTop());
    }
  };

  return {
    navigate,
    goBack,
    reset,
    replace,
    popToTop,
  };
};

export const createNavigationService = () => {
  let navigationRef: RefObject<
    NavigationContainerRef<RootStackParamList>
  > | null = null;
  let navigationActions: ReturnType<typeof createNavigationActions> | null =
    null;

  const setNavigationRef = (
    ref: NavigationContainerRef<RootStackParamList> | null,
  ) => {
    if (ref) {
      navigationRef = {current: ref};
      navigationActions = createNavigationActions(navigationRef);
    }
  };

  const getNavigationActions = () => {
    if (!navigationActions) {
      console.warn(
        'Navigation ref not set. Make sure NavigationService is initialized in App.tsx',
      );

      return {
        navigate: (() => {}) as NavigateFunction,
        goBack: () => {},
        reset: () => {},
        replace: (() => {}) as NavigateFunction,
        popToTop: () => {},
      };
    }
    return navigationActions;
  };

  const isReady = () => {
    return !!navigationActions;
  };

  return {
    setNavigationRef,
    getNavigationActions,
    isReady,
  };
};

// Singleton instance
export const navigationService = createNavigationService();
