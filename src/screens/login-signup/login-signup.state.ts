import {useEffect, useMemo, useState} from 'react';
import {strings} from '../../constants/strings/login-signup.strings';
import {validateEmail} from '../../services/custom-services';
import {ErrorNotificationHandler} from '../../services/ErrorNotificationHandler';
import {EAuthMode} from './login-sign-up.types';
import {locallyEmailForSignIn} from '../../services/async-storage/async-storage-service';

const signUpLoginStrings = {
  [EAuthMode.register]: {
    head: strings.createYourAccount,
    sub: strings.useYourEmail,
    alt1: strings.alreadyHaveAccount,
    alt2: strings.login,
  },
  [EAuthMode.logIn]: {
    head: strings.welcomeBack,
    sub: '',
    alt1: strings.dontHaveAccount,
    alt2: strings.register,
  },
};

export const useLoginSignUpUserState = () => {
  const [isEmailValid, setIsEmailValid] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailPasswordStep, setEmailPasswordStep] = useState(false);
  const [mode, setMode] = useState<EAuthMode>(EAuthMode.logIn);
  const [isLoading, setLoading] = useState(false);

  const validateCurrentEmail = (emailCurrent: string) => {
    if (!emailCurrent) return;
    const isValid = validateEmail(emailCurrent);
    setIsEmailValid(!!isValid);
  };

  const onForgotPassword = () => setMode(EAuthMode.resetPassword);

  const onChangeMode = () =>
    setMode((currentMode: EAuthMode) =>
      currentMode === EAuthMode.register ? EAuthMode.logIn : EAuthMode.register,
    );

  const emailSignUp = async () => {
    try {
      await onSignUp(email, password);
    } catch (error) {
      const currentError = error as {code: string; message: string};
      console.error('Email login / sign up error', currentError.message);
    }
  };

  const getEmailLocally = async () => {
    const currentEmail = await locallyEmailForSignIn.get();

    setEmail(currentEmail);
  };

  const onSignUp = async (authEmail: string, authPassword: string) => {
    try {
      console.log('Check Sign Up Email and Password', authEmail, authPassword);
      // setLoading(true);
      // window.localStorage.setItem('emailLoginToDashboard', 'true');
      // const result = await createUserWithEmailAndPassword(
      //   authInstance,
      //   authEmail,
      //   authPassword,
      // );
      // await sendEmailVerification(
      //   result.user,
      //   manualEncryptionActionCodeSettings,
      // );
      // setEmailSent(EmailSendStatus.Sent);
    } catch (error) {
      const currentError = error as Error;
      console.error('Sign Up Error', currentError);
    } finally {
      setLoading(false);
    }
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

  const checkEmail = async (email: string) => {
    console.log('Check Email', email);
    return true;
    // try {
    //   const result = await fetchSignInMethodsForEmail(authInstance, email);
    //   if (result[0] === 'emailLink') {
    //     await loginWithEmailLink(email);
    //     return true;
    //   }
    //   if (result[0] === 'google.com') {
    //     await onGoogleSignUp();
    //     return true;
    //   }
    //   if (result[0] === 'microsoft.com') {
    //     await onMicrosoftSignUp();
    //     return true;
    //   }
    //   setEmail(email);
    //   return result.length > 0;
    // } catch (error) {
    //   setLoading(true);
    //   ErrorNotificationHandler({
    //     type: EPopupType.DEFAULT,
    //     message: 'Sign In Error',
    //   });
    //   throw error;
    // } finally {
    //   setLoading(false);
    // }
  };

  const setStep = async () => {
    const isEmailSignedUp = await checkEmail(email);
    if (isEmailSignedUp && mode === EAuthMode.register) {
      ErrorNotificationHandler({
        message: 'Email already registered. Log in instead',
      });
      return;
    }
    if (!isEmailSignedUp && mode === EAuthMode.logIn) {
      ErrorNotificationHandler({
        message: 'Email not registered. Please sign up instead',
      });
      return;
    }

    setEmailPasswordStep((currentStep: boolean) => !currentStep);
  };

  useEffect(() => {
    getEmailLocally();
  }, []);

  useEffect(() => {
    validateCurrentEmail(email);
  }, [email]);

  const currentStrings = useMemo(
    () => signUpLoginStrings[mode as keyof typeof signUpLoginStrings],
    [mode],
  );

  return {
    currentStrings,
    isEmailValid,
    email,
    password,
    emailPasswordStep,
    mode,
    isLoading,
    onMicrosoftSignUp,
    onGoogleSignUp,
    setStep,
    setPassword,
    emailSignUp,
    onChangeMode,
    onForgotPassword,
    setEmail,
  };
};
