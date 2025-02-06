// import {useDispatch} from 'react-redux';
import {useReduxSelector} from '../store/store';

export const useAppNavigatorState = () => {
  const {token} = useReduxSelector(
    state => state.anonymousUserReducer.userAccountData,
  );

  const isAuthenticated = !!token;

  return {
    isAuthenticated,
  };
};
