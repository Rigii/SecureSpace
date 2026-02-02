import {useCallback, useEffect, useState} from 'react';
import {EAuthMode} from './login-sign-up.types';
import {locallyEmailForSignIn} from '../../services/async-secure-storage/async-storage-service';
import {useDispatch} from 'react-redux';

import {loginRequested} from '../../app/store/saga/auth-saga/auth.actions';
import {strings} from './login-signup.strings';

export const useLoginSignUpUserState = () => {
  const [mode, setMode] = useState<EAuthMode>(EAuthMode.logIn);
  const [isLoading] = useState(false);

  const dispatch = useDispatch();

  const onForgotPassword = () => setMode(EAuthMode.resetPassword);

  const onChangeMode = () =>
    setMode((currentMode: EAuthMode) =>
      currentMode === EAuthMode.signUp ? EAuthMode.logIn : EAuthMode.signUp,
    );

  const getEmailLocally = async () => {
    return await locallyEmailForSignIn.get();
  };

  const loginSignUp = useCallback(
    async (signInData: {email: string; password: string}) => {
      try {
        dispatch(
          loginRequested({
            email: signInData.email,
            password: signInData.password,
            mode,
            devicePrivateKey: null,
          }),
        );
      } catch (error) {
        console.error(strings.loginSignupError, error);
      }
    },
    [mode, dispatch],
  );

  useEffect(() => {
    getEmailLocally();
  }, []);

  return {
    mode,
    isLoading,
    loginSignUp,
    onChangeMode,
    onForgotPassword,
  };
};
