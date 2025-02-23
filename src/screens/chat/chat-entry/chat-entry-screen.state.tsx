import {useEffect} from 'react';
import {useReduxSelector} from '../../../app/store/store';
import {getChatUserApi} from '../../../services/api/chat/chat.api';
import {useDispatch} from 'react-redux';
import {storeUserChats} from '../../../app/store/state/userChats/userChatsAction';
import {
  IChatRoomId,
  IInvitations,
} from '../../../app/store/state/userChats/userChatsState.types';

export const ChatEntryScreenState = () => {
  const dispatch = useDispatch();
  const {id, token} = useReduxSelector(
    state => state.anonymousUserReducer.userAccountData,
  );
  const {accountId} = useReduxSelector(state => state.userChatsReducer);

  useEffect(() => {
    async function fetchData() {
      if (!!accountId) {
        return;
      }
      const response = await getChatUserApi(id, token);

      const storeData = {
        interlocutorId: response.data.interlocutor_id as string,
        accountId: response.data.account_id as string,
        created: response.data.created as Date,
        updated: response.data.updated as Date,
        email: response.data.email as string,
        chatRoomIds: response.data.chat_room_ids as IChatRoomId[],
        invitations: response.data.invitations as IInvitations[],
      };

      dispatch(storeUserChats(storeData));
    }

    fetchData();
  }, [accountId, dispatch, id, token]);

  return {accountId};
};
