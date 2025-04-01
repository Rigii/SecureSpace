import {useEffect} from 'react';
import {useReduxSelector} from '../../../app/store/store';
import {getChatUserApi} from '../../../services/api/chat/chat-api';
import {useDispatch} from 'react-redux';
import {updateUserChatsAccountSlice} from '../../../app/store/state/userChats/userChatsAction';
import {
  IChatRoomId,
  IInvitations,
} from '../../../app/store/state/userChats/userChatsState.types';

export const ChatEntryScreenState = () => {
  const dispatch = useDispatch();
  const {id, token} = useReduxSelector(
    state => state.anonymousUserReducer.userAccountData,
  );
  const {accountId, publicChatKey} = useReduxSelector(
    state => state.userChatsReducer,
  );

  useEffect(() => {
    async function fetchData() {
      if (!!accountId) {
        return;
      }

      const response = await getChatUserApi(id, token);
      const storeData = {
        interlocutorId: response.data.interlocutor_id as string,
        accountId: response.data.chat_account_id as string,
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
  }, [accountId, id, token, dispatch]);

  return {accountId, publicChatKey};
};
