import {useCallback, useEffect, useState} from 'react';
import {EAuthMode} from './login-sign-up.types';
import {locallyEmailForSignIn} from '../../services/async-secure-storage/async-storage-service';
import {useDispatch} from 'react-redux';

import {loginRequested} from '../../app/store/saga/user/authFlow.actions';

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

  // const loginSignUp = async (signInData: {email: string; password: string}) => {
  //   try {
  //     const isSignUp = mode === EAuthMode.signUp;

  //     const {data} = await registerSignInUserApi(signInData, isSignUp);

  //     const user = data.user;

  //     const fetchedUserData = {
  //       id: user.id,
  //       role: user.role,
  //       created: user.created,
  //       isOnboardingDone: user.user_info?.is_onboarding_done as boolean,
  //       email: user.email,
  //       token: data?.token || '',
  //       portraitUri: user.user_info?.portrait_uri as string,
  //       title: user.user_info?.title as string,
  //       phoneNumber: user.user_info?.phone_number as string,
  //       securePlaces: null,
  //     };

  //     const userSecurityData = user.user_info?.data_secrets;

  //     const fullUserData = {
  //       ...fetchedUserData,
  //       securePlaces: userSecurityData?.securePlaces || null,
  //     };

  //     dispatch(setUser(fullUserData));

  //     /* Is Email Verified */
  //     if (!user.email_verified) {
  //       ErrorNotificationHandler({
  //         text1: strings.confirmYourEmail,
  //         text2: strings.emailLinkPrevioslySent,
  //       });
  //       return;
  //     }

  //     /* Check is onboarding passed & Redirection */
  //     if (!user.user_info || !user.user_info.is_onboarding_done) {
  //       navigation.navigate(applicationRoutes.onboarding);
  //       return;
  //     }

  //     /* Handle App encryption keys */
  //     if (!devicePrivateKey) {
  //       // Check key in keychain
  //       const currentKeychainPrivateKey = await getSecretKeychain({
  //         type: EKeychainSecrets.devicePrivateKey,
  //         encryptKeyDataPassword: '',
  //         email: user.email,
  //       });

  //       if (!currentKeychainPrivateKey) {
  //         // Redirect to upload key screen
  //         const fetchedAllUserDevicePublicKeys =
  //           user.user_info?.data_secrets.user_public_keys;

  //         navigation.navigate(applicationRoutes.uploadKey, {
  //           publicKey: fetchedAllUserDevicePublicKeys[0].public_key,
  //           keyRecordId: fetchedAllUserDevicePublicKeys[0].id,
  //           keyRecordDate: fetchedAllUserDevicePublicKeys[0].created,
  //         });
  //         return;
  //       }
  //     }

  //     /* Storing chat data in the Redux store */
  //     const currentPrivateKey = await getSecretKeychain({
  //       type: EKeychainSecrets.chatPrivateKey,
  //       encryptKeyDataPassword: '',
  //       email: user.email,
  //     });

  //     const userChatAccountData = user?.user_info?.user_chat_account;

  //     if (user?.user_info?.user_chat_account?.interlocutor_id) {
  //       const chatAccountData = {
  //         email: user.email,
  //         interlocutorId: userChatAccountData?.interlocutor_id,
  //         chatAccountId: userChatAccountData?.chat_account_id,
  //         created: userChatAccountData?.created,
  //         updated: userChatAccountData?.updated,
  //         invitations: userChatAccountData?.invitations,
  //         publicChatKey: userChatAccountData?.public_chat_key,
  //         privateChatKey: currentPrivateKey,
  //       };

  //       dispatch(updateUserChatsAccountSlice(chatAccountData));
  //     }

  //     /* Storing user chat rooms in the Redux store */
  //     const userChatRooms = userChatAccountData?.chat_rooms;
  //     if (userChatRooms) {
  //       const userChatsObject = userChatRooms.reduce(
  //         (accumulator: any, currentValue: any) => {
  //           const chatRoomData: IChatRoom = {
  //             id: currentValue.id,
  //             password: '',
  //             chatName: currentValue.chat_name,
  //             chatType: currentValue.chat_type,
  //             ownerId: currentValue.owner_id,
  //             moderatorIds: currentValue.moderator_ids,
  //             usersData: currentValue.users_data,
  //             invitedUserIds: currentValue.invited_user_ids,
  //             messageDurationHours: currentValue.message_duration_hours,
  //             chatMediaStorageUrl: currentValue.chat_media_storage_url,
  //             chatIconUrl: currentValue.chat_icon_url,
  //             availabilityAreaData: currentValue.availability_area_data,
  //             messages: currentValue.messages || [],
  //           };
  //           return {...accumulator, [chatRoomData.id]: chatRoomData};
  //         },
  //         {},
  //       );

  //       dispatch(addUserChatRooms(userChatsObject));
  //     }

  //     navigation.navigate(applicationRoutes.root);
  //   } catch (error) {
  //     const currentError = error as AxiosError<IHttpExceptionResponse>;
  //     if (currentError.response?.data.message) {
  //       ErrorNotificationHandler({
  //         text1: strings.dontHaveAccount,
  //         text2: strings.pleaseSignUp,
  //       });
  //     }
  //   }
  // };
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
        console.error('Login error:', error);
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
