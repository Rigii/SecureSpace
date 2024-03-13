// import {SCREENS} from '@app/constants/screen-cases';
// import {
//   NavigationActions,
//   NavigationContainerComponent,
//   NavigationParams,
//   StackActions,
// } from 'react-navigation';
// // import {StackNavigationProp} from 'react-navigation-stack/lib/typescript/src/vendor/types';

// export const resetToHomeAction = StackActions.reset({
//   index: 0,
//   actions: [NavigationActions.navigate({routeName: SCREENS.home_stack})],
// });

// let _navigator: NavigationContainerComponent;

// const setTopLevelNavigator = (
//   navigatorRef: NavigationContainerComponent | null,
// ) => {
//   if (!navigatorRef) return;
//   _navigator = navigatorRef;
// };

// const getCurrentNavigationState = () => {
//   if (!_navigator) return;
//   return _navigator.state;
// };

// const navigate = (routeName: string, params?: NavigationParams | undefined) => {
//   _navigator.props.screenProps;
//   return _navigator.dispatch(
//     NavigationActions.navigate({
//       routeName,
//       params,
//     }),
//   );
// };

// const goBack = () => {
//   _navigator.props.screenProps;
//   return _navigator.dispatch(NavigationActions.back());
// };

// const stackNavigate = (
//   rootRouteName: string,
//   params: NavigationParams | undefined,
// ) => {
//   navigate(rootRouteName, params);
//   navigate(params?.routeName, params?.params);
// };

// export default {
//   navigate,
//   setTopLevelNavigator,
//   stackNavigate,
//   getCurrentNavigationState,
//   goBack,
// };
