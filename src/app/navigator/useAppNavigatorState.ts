// import {useDispatch} from 'react-redux';
import {useReduxSelector} from '../store/store';

export const useAppNavigatorState = () => {
  const {token} = useReduxSelector(state => state.anonymousUserReducer);

  //   const dispatch = useDispatch();

  const isAuthenticated = !!token;

  return {
    isAuthenticated,
  };
};
