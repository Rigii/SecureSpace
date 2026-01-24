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
import {IChatRoom} from '../../app/store/state/chatRoomsContent/chatRoomsState.types';
import {useReduxSelector} from '../../app/store/store';
import {
  EKeychainSectets,
  getSecretKeychain,
} from '../../services/secrets-keychains/store-secret-keychain';

export const useLoginSignUpUserState = ({navigation}: {navigation: any}) => {
  const [mode, setMode] = useState<EAuthMode>(EAuthMode.logIn);
  const [isLoading] = useState(false);
  const {devicePrivateKey} = useReduxSelector(
    state => state.anonymousUserReducer.securityData?.pgpDeviceKeyData,
  );
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
  };

  const proceedUserAuthData = async (user: IFetchedUserAuthData) => {
    if (!user.user_info) {
      navigation.navigate(manualEncryptionScreenRoutes.onboarding);
      return;
    }

    if (!devicePrivateKey) {
      const currentKeychainPrivateKey = await getSecretKeychain({
        type: EKeychainSectets.chatPrivateKey,
        encryptKeyDataPassword: '',
        email: user.email,
      });
      if (currentKeychainPrivateKey) {
        return;
      }
      const fetchedAllUserDevicePublicKeys =
        user.user_info?.data_secrets.user_public_keys;

      navigation.navigate(manualEncryptionScreenRoutes.uploadKey, {
        publicKey: fetchedAllUserDevicePublicKeys[0].public_key,
        keyRecordId: fetchedAllUserDevicePublicKeys[0].id,
        keyRecordDate: fetchedAllUserDevicePublicKeys[0].created,
      });
      return;
    }
    navigation.navigate(manualEncryptionScreenRoutes.root);
  };

  const loginSignUp = async (signInData: {email: string; password: string}) => {
    try {
      const isSignUp = mode === EAuthMode.signUp;
      const {data} = await registerSignInUserApi(signInData, isSignUp);
      const user = data.user;

      if (!user.email_verified) {
        ErrorNotificationHandler({
          text1: strings.confirmYourEmail,
          text2: strings.emailLinkPrevioslySent,
        });
        return;
      }

      const fetchedUserData = {
        id: user.id,
        role: user.role,
        created: user.created,
        isOnboardingDone: user.user_info?.is_onboarding_done as boolean,
        email: user.email,
        token: data?.token || '',
        portraitUri: user.user_info?.portrait_uri as string,
        title: user.user_info?.title as string,
        phoneNumber: user.user_info?.phone_number as string,
        securePlaces: null,
      };

      if (!user.user_info) {
        dispatch(setUser(fetchedUserData));

        navigation.navigate(manualEncryptionScreenRoutes.onboarding);
        return;
      }

      const userChats = user?.user_info?.user_chat_account;

      const userSecurityData = user.user_info?.data_secrets;

      const fullUserData = {
        ...fetchedUserData,
        securePlaces: userSecurityData?.securePlaces || null,
      };

      dispatch(setUser(fullUserData));
      const currentPrivateKey = await getSecretKeychain({
        type: EKeychainSectets.chatPrivateKey,
        encryptKeyDataPassword: '',
        email: user.email,
      });

      if (user?.user_info?.user_chat_account?.interlocutor_id) {
        const chatAccountData = {
          email: user.email,
          interlocutorId: userChats?.interlocutor_id,
          chatAccountId: userChats?.chat_account_id,
          created: userChats?.created,
          updated: userChats?.updated,
          invitations: userChats?.invitations,
          publicChatKey: userChats?.public_chat_key,
          privateChatKey: currentPrivateKey,
        };

        dispatch(updateUserChatsAccountSlice(chatAccountData));
      }

      const userChatRooms = userChats?.chat_rooms;
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
              messages: currentValue.messages || [],
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
