import {useEffect, useState} from 'react';
import {EAuthMode, IUserAuthData} from './login-sign-up.types';
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
import {
  IFetchedChatRoomsData,
  IInvitations,
} from '../../app/store/state/userChatAccount/userChatAccount.types';
import {addUserChatRooms} from '../../app/store/state/chatRoomsContent/chatRoomsAction';
import {IChatRoom} from '../../app/store/state/chatRoomsContent/chatRoomsState.types';
import {IUserAccount} from '../../app/store/state/userState/userState.types';

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

  const proceedUserAuthData = (user: IUserAuthData) => {
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

      const user = responce.data.user as IUserAuthData;
      const token = responce.data.token;
      console.log(333333, user?.user_info?.user_chats);

      const userData: IUserAccount = {
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

      if (user?.user_info?.interlocutorId) {
        const chatAccountData: IFetchedChatRoomsData = {
          email: user.email,
          interlocutorId: user.user_info?.interlocutor_id as string,
          chatAccountId: user.user_info?.chat_account_id as string,
          created: user.user_info?.created as unknown as Date,
          updated: user.user_info?.updated as unknown as Date,
          invitations: user.user_info?.invitations as unknown as IInvitations[],
        };
        dispatch(updateUserChatsAccountSlice(chatAccountData));
      }

      const userChatRooms = user?.user_info?.user_chats as any[];

      if (userChatRooms) {
        const userChatsObject = userChatRooms.reduce(
          (accumulator: any, currentValue: any) => {
            const chatRoomData: IChatRoom = {
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
