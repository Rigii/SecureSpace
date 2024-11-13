import {useEffect, useState} from 'react';
import {EAuthMode, IUserAuthData} from './login-sign-up.types';
import {locallyEmailForSignIn} from '../../services/async-storage/async-storage-service';
import {registerSignInUserApi} from '../../services/api/user/user.api';
import {ErrorNotificationHandler} from '../../services/ErrorNotificationHandler';
import {strings} from '../../constants/strings/login-signup.strings';
import {IHttpExceptionResponse} from '../../services/xhr-services/xhr.types';
import {AxiosError} from 'axios';
import {manualEncryptionScreenRoutes} from '../../app/navigator/screens';
import {useDispatch} from 'react-redux';
import {setUser} from '../../app/store/state/userState/userAction';

export const useLoginSignUpUserState = ({navigation}: {navigation: any}) => {
  const [mode, setMode] = useState<EAuthMode>(EAuthMode.logIn);
  const [isLoading, setLoading] = useState(false);
  const dispatch = useDispatch();

  const onForgotPassword = () => setMode(EAuthMode.resetPassword);

  const onChangeMode = () =>
    setMode((currentMode: EAuthMode) =>
      currentMode === EAuthMode.signUp ? EAuthMode.logIn : EAuthMode.signUp,
    );

  const getEmailLocally = async () => {
    return await locallyEmailForSignIn.get();
  };

  const onGoogleSignUp = async () => {
    console.log('Check Google Sign Up');
    // try {
    //   setLoading(true);
    //   await signInUser(userAdapter, false);
    // } catch (error) {
    //   console.error('Sign Up Error', error);
    // }
  };

  const onMicrosoftSignUp = async () => {
    console.log('Check Microsoft Sign Up');
    // try {
    //   setLoading(true);
    //   await signInWithMicrosoft();
    // } catch (error) {
    //   const currentError = error as Error;
    //   ErrorNotificationHandler({
    //     type: EPopupType.DEFAULT,
    //     message: 'Sign Up Error',
    //   });
    //   console.error('Sign Up Error', currentError, currentError.message);
    // }
  };

  const proceedUserAuthData = (user: IUserAuthData) => {
    if (!user.user_info) {
      navigation.navigate(manualEncryptionScreenRoutes.onboarding);
      // Redirect here
    }
  };

  const loginSignUp = async (signInData: {email: string; password: string}) => {
    try {
      const isSignUp = mode === EAuthMode.signUp;
      const responce = await registerSignInUserApi(signInData, isSignUp);
      if (isSignUp) {
        ErrorNotificationHandler({
          text1: strings.confirmYourEmail,
          text2: strings.emailLinkSent,
        });
      }

      const user = responce.data.user as IUserAuthData;
      const token = responce.data.token;

      dispatch(
        setUser({
          id: user.id,
          role: user.role,
          created: user.created,
          isOnboardingDone: user.user_info?.is_onboarding_done as boolean,
          email: user.email,
          token,
          portraitUri: user.user_info?.portrait_uri as string,
          title: user.user_info?.title as string,
          phoneNumber: user.user_info?.phone_number as string,
        }),
      );

      proceedUserAuthData(user);
    } catch (error) {
      const currentError = error as AxiosError<IHttpExceptionResponse>;
      if (currentError.response?.data.message === 'Not exist') {
        ErrorNotificationHandler({
          text1: strings.dontHaveAccount,
          text2: strings.pleaseSignUp,
        });
      }
    }
  };

  useEffect(() => {
    getEmailLocally();
  }, []);

  return {
    mode,
    isLoading,
    loginSignUp,
    onMicrosoftSignUp,
    onGoogleSignUp,
    onChangeMode,
    onForgotPassword,
  };
};
