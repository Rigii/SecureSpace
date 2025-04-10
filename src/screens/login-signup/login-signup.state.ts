import {useEffect, useState} from 'react';
import {EAuthMode, IFetchedUserAuthData} from './login-sign-up.types';
import {locallyEmailForSignIn} from '../../services/async-secure-storage/async-storage-service';
import {registerSignInUserApi} from '../../services/api/user/user.api';
import {ErrorNotificationHandler} from '../../services/ErrorNotificationHandler';
import {strings} from '../../constants/strings/login-signup.strings';
import {IHttpExceptionResponse} from '../../services/xhr-services/xhr.types';
import {AxiosError} from 'axios';
import {manualEncryptionScreenRoutes} from '../../app/navigator/screens';
import {useDispatch} from 'react-redux';
import {setUser} from '../../app/store/state/userState/userAction';
import {updateUserChatsAccountSlice} from '../../app/store/state/userChatAccount/userChatAccountAction';
import {addUserChatRooms} from '../../app/store/state/chatRoomsContent/chatRoomsAction';

export const useLoginSignUpUserState = ({navigation}: {navigation: any}) => {
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

  const onGoogleSignUp = async () => {
    console.log('Check Google Sign Up');
    // try {
    //   setLoading(true);
    //   await signInUser(userAdapter, false);
    // } catch (error) {
    //   console.error('Sign Up Error', error);
    // }
  };

  const proceedUserAuthData = (user: IFetchedUserAuthData) => {
    if (!user.user_info) {
      navigation.navigate(manualEncryptionScreenRoutes.onboarding);
      return;
      // Redirect here
    }
    navigation.navigate(manualEncryptionScreenRoutes.home);
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

      const user = responce.data.user as IFetchedUserAuthData;
      const userChats = user?.user_info?.user_chats;
      const token = responce.data.token;
      const userData = {
        id: user.id,
        role: user.role,
        created: user.created,
        isOnboardingDone: user.user_info?.is_onboarding_done as boolean,
        email: user.email,
        token,
        portraitUri: user.user_info?.portrait_uri as string,
        title: user.user_info?.title as string,
        phoneNumber: user.user_info?.phone_number as string,
      };

      dispatch(setUser(userData));

      if (user?.user_info.user_chats?.interlocutor_id) {
        const chatAccountData = {
          email: user.email,
          interlocutorId: userChats?.interlocutor_id,
          chatAccountId: userChats?.chat_account_id,
          created: userChats?.created,
          updated: userChats?.updated,
          invitations: userChats?.invitations,
        };

        dispatch(updateUserChatsAccountSlice(chatAccountData));
      }

      const userChatRooms = userChats?.chat_rooms;
      if (userChatRooms) {
        const userChatsObject = userChatRooms.reduce(
          (accumulator: any, currentValue: any) => {
            const chatRoomData = {
              id: currentValue.id,
              password: '',
              chatName: currentValue.chat_name,
              chatType: currentValue.chat_type,
              ownerId: currentValue.owner_id,
              moderatorIds: currentValue.moderator_ids,
              usersData: currentValue.users_data,
              invitedUserIds: currentValue.invited_user_ids,
              messageDurationHours: currentValue.message_duration_hours,
              chatMediaStorageUrl: currentValue.chat_media_storage_url,
              chatIconUrl: currentValue.chat_icon_url,
              availabilityAreaData: currentValue.availability_area_data,
              messages: currentValue.messages,
            };
            return {...accumulator, [chatRoomData.id]: chatRoomData};
          },
          {},
        );

        dispatch(addUserChatRooms(userChatsObject));
      }
      proceedUserAuthData(user);
    } catch (error) {
      const currentError = error as AxiosError<IHttpExceptionResponse>;
      if (currentError.response?.data.message) {
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
    onGoogleSignUp,
    onChangeMode,
    onForgotPassword,
  };
};
