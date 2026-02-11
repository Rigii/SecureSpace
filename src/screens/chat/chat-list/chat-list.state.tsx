import {NavigationProp, useNavigation} from '@react-navigation/native';
import {useReduxSelector} from '../../../app/store/store';
import {
  applicationRoutes,
  RootStackParamList,
} from '../../../app/navigator/screens';

export const useChatListState = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  const chatRooms = useReduxSelector(state => state.chatRoomsSlice);
  const userChatAccount = useReduxSelector(
    state => state.userChatAccountReducer,
  );
  const chatRoomsArray = Object.values(chatRooms);

  const navigateCreateChat = () => {
    navigation.navigate(applicationRoutes.createChatRoom);
  };

  const navigateToChatRoom = (chatId: string) => {
    navigation.navigate(applicationRoutes.chatRoom, {
      chatId,
      participantId: userChatAccount?.interlocutorId,
    });
  };

  return {
    chatRoomsArray,
    interlocutorId: userChatAccount?.interlocutorId,
    navigateCreateChat,
    navigateToChatRoom,
  };
};
