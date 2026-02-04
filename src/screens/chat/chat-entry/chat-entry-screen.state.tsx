import {useEffect} from 'react';
import {useReduxSelector} from '../../../app/store/store';
import {useDispatch} from 'react-redux';
import {
  RootStackParamList,
  applicationRoutes,
} from '../../../app/navigator/screens';
import {NavigationProp, useNavigation} from '@react-navigation/native';
import {ITopBarMenuActions} from '../../../HOC/combined-bar-component/combined-component';
import {menuActionIds} from './constants';
import {strings} from './strings';
import {fetchUpdateChatStateSaga} from '../../../app/store/saga/chat-account-saga/chat-account.actions';

export const ChatEntryScreenState = ({
  injectActions,
}: {
  injectActions?: ((actions: ITopBarMenuActions[]) => void) | undefined;
}) => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const dispatch = useDispatch();

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
    dispatch(fetchUpdateChatStateSaga());
  }, [chatAccountId, privateChatKey, dispatch, navigation]);

  return {accountId: chatAccountId, privateChatKey};
};
