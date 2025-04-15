import {useReduxSelector} from '../../../app/store/store';

export const ChatListState = () => {
  const chatRooms = useReduxSelector(state => state.chatRoomsReducer);
  const userChatAccount = useReduxSelector(
    state => state.userChatAccountReducer,
  );

  const chatRoomsArray = Object.values(chatRooms);

  return {chatRoomsArray, interlocutorId: userChatAccount?.interlocutorId};
};
