import {useEffect} from 'react';
import {useReduxSelector} from '../../../app/store/store';
import {getChatUserApi} from '../../../services/api/chat/chat-api';
import {useDispatch} from 'react-redux';
import {updateUserChatsAccountSlice} from '../../../app/store/state/userChatAccount/userChatAccountAction';
import {
  IChatRoomId,
  IInvitations,
} from '../../../app/store/state/userChatAccount/userChatAccount.types';
import {
  RootStackParamList,
  applicationRoutes,
} from '../../../app/navigator/screens';
import {NavigationProp, useNavigation} from '@react-navigation/native';
import {ITopBarMenuActions} from '../../../HOC/combined-bar-component/combined-component';
import {
  EKeychainSecrets,
  getSecretKeychain,
} from '../../../services/secrets-keychains/store-secret-keychain';
import {menuActionIds} from './constants';
import {strings} from './strings';

export const ChatEntryScreenState = ({
  injectActions,
}: {
  injectActions?: ((actions: ITopBarMenuActions[]) => void) | undefined;
}) => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const dispatch = useDispatch();
  const {id, token} = useReduxSelector(
    state => state.anonymousUserReducer.userAccountData,
  );
  const {chatAccountId, privateChatKey} = useReduxSelector(
    state => state.userChatAccountReducer,
  );

  useEffect(() => {
    const onCreateChatRoom = () => {
      navigation.navigate(applicationRoutes.createChatRoom);
    };

    const menuActions = [
      {
        id: menuActionIds.SEARCH,
        label: strings.search,
        icon: '',
        action: () => null,
      },
      {
        id: menuActionIds.CREATE_ROOM,
        label: strings.createRoom,
        icon: '',
        action: onCreateChatRoom,
      },
      {
        id: menuActionIds.SETTINGS,
        label: strings.settings,
        icon: '',
        action: () => null,
      },
    ];
    injectActions?.(menuActions);
  }, [injectActions, navigation]);

  useEffect(() => {
    async function fetchData() {
      try {
        if (!!chatAccountId && !!privateChatKey) {
          return;
        }

        const response = await getChatUserApi(id, token);

        const currentPrivateKey = await getSecretKeychain({
          type: EKeychainSecrets.chatPrivateKey,
          encryptKeyDataPassword: '',
          email: response.data.email,
        });

        const storeData = {
          interlocutorId: response.data.interlocutor_id as string,
          chatAccountId: response.data.chat_account_id as string,
          created: response.data.created as Date,
          updated: response.data.updated as Date,
          email: response.data.email as string,
          chatRoomIds: response.data.chat_room_ids as IChatRoomId[],
          invitations: response.data.invitations as IInvitations[],
          publicChatKey: response.data.public_chat_key as string,
          privateChatKey: currentPrivateKey,
        };

        dispatch(updateUserChatsAccountSlice(storeData));
      } catch (error) {
        const currentError = error as Error;
        console.error(currentError);
      }
    }

    fetchData();
  }, [chatAccountId, id, token, privateChatKey, dispatch, navigation]);

  return {accountId: chatAccountId, privateChatKey};
};
