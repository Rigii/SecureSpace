import {useEffect, useState} from 'react';
import {EAuthMode} from './login-sign-up.types';
import {locallyEmailForSignIn} from '../../services/async-storage/async-storage-service';
import {registerSignInUserApi} from '../../services/api/user.api';

export const useLoginSignUpUserState = () => {
  const [mode, setMode] = useState<EAuthMode>(EAuthMode.logIn);
  const [isLoading, setLoading] = useState(false);

  const onForgotPassword = () => setMode(EAuthMode.resetPassword);

  const onChangeMode = () =>
    setMode((currentMode: EAuthMode) =>
      currentMode === EAuthMode.register ? EAuthMode.logIn : EAuthMode.register,
    );

  const getEmailLocally = async () => {
    return await locallyEmailForSignIn.get();
  };

  // const onSignUp = async (authEmail: string, authPassword: string) => {
  //   try {
  //     console.log('Check Sign Up Email and Password', authEmail, authPassword);
  //   } catch (error) {
  //     const currentError = error as Error;
  //     console.error('Sign Up Error', currentError);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

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

  // const checkEmail = async (email: string) => {
  //   console.log('Check Email', email);
  //   return true;
  //   // try {
  //   //   const result = await fetchSignInMethodsForEmail(authInstance, email);
  //   //   if (result[0] === 'emailLink') {
  //   //     await loginWithEmailLink(email);
  //   //     return true;
  //   //   }
  //   //   if (result[0] === 'google.com') {
  //   //     await onGoogleSignUp();
  //   //     return true;
  //   //   }
  //   //   if (result[0] === 'microsoft.com') {
  //   //     await onMicrosoftSignUp();
  //   //     return true;
  //   //   }
  //   //   setEmail(email);
  //   //   return result.length > 0;
  //   // } catch (error) {
  //   //   setLoading(true);
  //   //   ErrorNotificationHandler({
  //   //     type: EPopupType.DEFAULT,
  //   //     message: 'Sign In Error',
  //   //   });
  //   //   throw error;
  //   // } finally {
  //   //   setLoading(false);
  //   // }
  // };

  // const onLogIn = async (authEmail: string, authPassword: string) => {
  //   try {
  //     console.log('Check Sign Up Email and Password', authEmail, authPassword);
  //   } catch (error) {
  //     const currentError = error as Error;
  //     console.error('Login Error', currentError);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const loginSignUp = async (signInData: {email: string; password: string}) => {
    try {
      const responce = registerSignInUserApi(signInData);

      console.log(333333, responce);
    } catch (error) {
      const currentError = error as keyof typeof Error;
      console.error('Login, Sign Up Error:', currentError);
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
