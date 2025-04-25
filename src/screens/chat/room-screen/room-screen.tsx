import React from 'react';
import {View, FlatList} from 'react-native';
import {NavigationProp, useNavigation} from '@react-navigation/native';
import {useReduxSelector} from '../../../app/store/store';
import {ChatMessage} from './components/chat-message.component';
import {IChatMessage} from '../../../app/store/state/chatRoomsContent/chatRoomsState.types';
import {Input, KeyboardTypes} from '../../../components/input';
import {strings} from '../chat.strings';

interface IChatRoomScreen {
  chatId: string;
}

const ChatRoomScreen: React.FC<IChatRoomScreen> = ({chatId}) => {
  // const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  const [currentMessage, setCurrentMessage] = React.useState<string>('');
  const userChatRooms = useReduxSelector(state => state.chatRoomsReducer);
  const participantId = useReduxSelector(
    state => state.userChatAccountReducer.interlocutorId,
  );

  const {messages} = userChatRooms[chatId];
  const sortedByDateMessages = messages?.sort(
    (a: IChatMessage, b: IChatMessage) =>
      new Date(b.created).getTime() - new Date(a.created).getTime(),
  );

  return (
    <View className="flex-1">
      <FlatList
        data={sortedByDateMessages}
        keyExtractor={item => item.id}
        renderItem={({item}) => (
          <ChatMessage
            message={item.content}
            isOwnMessage={item.participant_id === participantId}
            senderName={item.sender_nik_name}
            time={item.created.toUTCString()}
          />
        )}
        showsVerticalScrollIndicator={false}
      />
      <Input
        value={currentMessage}
        onBlur={() => null}
        onChange={setCurrentMessage}
        name="room-message"
        placeholder={strings.enterYourMessage}
        keyboardType={KeyboardTypes.default}
        className="w-80"
      />
    </View>
  );
};

export default ChatRoomScreen;
