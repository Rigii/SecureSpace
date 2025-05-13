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
  manualEncryptionScreenRoutes,
} from '../../../app/navigator/screens';
import {NavigationProp, useNavigation} from '@react-navigation/native';
import {ITopBarMenuActions} from '../../../HOC/combined-bar-component/combined-component';

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
  const {chatAccountId, publicChatKey} = useReduxSelector(
    state => state.userChatAccountReducer,
  );

  useEffect(() => {
    const onCreateChatRoom = () => {
      navigation.navigate(manualEncryptionScreenRoutes.createChatRoom);
    };

    const menuActions = [
      {
        id: 'chatListSearch',
        label: 'Search',
        icon: '',
        action: () => null,
      },
      {
        id: 'chatListCreateRoom',
        label: 'Create Room',
        icon: '',
        action: onCreateChatRoom,
      },
      {
        id: 'chatListSettings',
        label: 'Account & Settings',
        icon: '',
        action: () => null,
      },
    ];
    injectActions?.(menuActions);
  }, [injectActions, navigation]);

  useEffect(() => {
    async function fetchData() {
      if (!!chatAccountId && !!publicChatKey) {
        return;
      }

      const response = await getChatUserApi(id, token);
      const storeData = {
        interlocutorId: response.data.interlocutor_id as string,
        chatAccountId: response.data.chat_account_id as string,
        created: response.data.created as Date,
        updated: response.data.updated as Date,
        email: response.data.email as string,
        chatRoomIds: response.data.chat_room_ids as IChatRoomId[],
        invitations: response.data.invitations as IInvitations[],
        publicChatKey: response.data.public_chat_key as string,
      };

      dispatch(updateUserChatsAccountSlice(storeData));
    }

    fetchData();
  }, [chatAccountId, id, token, publicChatKey, dispatch]);

  return {accountId: chatAccountId, publicChatKey};
};
