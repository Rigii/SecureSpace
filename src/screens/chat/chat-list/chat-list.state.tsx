import {useEffect} from 'react';
import {useReduxSelector} from '../../../app/store/store';
import {getChatRoomsData} from '../../../services/api/chat/chat-api';
import {useDispatch} from 'react-redux';
import {addUserChatRooms} from '../../../app/store/state/chatRoomsContent/chatRoomsAction';

export const ChatListState = () => {
  const dispatch = useDispatch();
  const {token} = useReduxSelector(
    state => state.anonymousUserReducer.userAccountData,
  );
  const {chatRoomIds} = useReduxSelector(state => state.userChatsReducer);
  const chatRooms = useReduxSelector(state => state.chatRoomsReducer);

  useEffect(() => {
    async function fetchData() {
      if (!chatRoomIds || !token) {
        return;
      }
      const chatIdsArray = chatRoomIds.map(chatId => chatId.chatId);

      if (chatIdsArray.length === 0) {
        return;
      }

      const response = await getChatRoomsData(chatIdsArray, token);

      const chatRoomsData = response.data.reduce(
        (
          accumulator: any,
          currentValue: {
            id: string;
            chat_name: string;
            chat_type: string;
            owner_id: string;
            moderator_ids: string[];
            participant_ids: string[];
            users_data: any;
            invited_user_ids: string[];
            chat_icon_url: string;
            messages: any;
            created: Date;
            updated: Date;
          },
        ) => {
          const storeData = {
            id: currentValue.id,
            chatName: currentValue.chat_name,
            chatType: currentValue.chat_type,
            ownerId: currentValue.owner_id,
            moderatorIds: currentValue.moderator_ids,
            participiantEmails: currentValue.participant_ids,
            usersData: currentValue.users_data,
            invitedUserIds: currentValue.invited_user_ids,
            chat_icon_url: currentValue.chat_icon_url,
            messages: currentValue.messages,
            created: currentValue.created || null,
            updated: currentValue.updated || null,
          };

          return {...accumulator, [storeData.id]: storeData};
        },
        {},
      );

      dispatch(addUserChatRooms(chatRoomsData));
    }

    fetchData();
  }, [chatRoomIds, token, dispatch]);

  return {chatRooms};
};
