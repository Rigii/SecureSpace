import {manualEncryptionScreenRoutes} from '../../app/navigator/screens';

export const sidebarModalSets = {
  [manualEncryptionScreenRoutes.chatRoom]: [
    {
      id: 'roomInfo',
      label: 'Room Info',
      icon: '',
      action: () => null,
    },
    {
      id: 'roomSearch',
      label: 'Search',
      icon: '',
      action: () => null,
    },
    {
      id: 'roomMute',
      label: 'Mute',
      icon: '',
      action: () => null,
    },
    {
      id: 'roomLeave',
      label: 'Leave',
      icon: '',
      action: () => null,
    },
    {
      id: 'roomReport',
      label: 'Report',
      icon: '',
      action: () => null,
    },
    {
      id: 'roomDelete',
      label: 'Delete',
      icon: '',
      action: () => null,
    },
  ],
  [manualEncryptionScreenRoutes.chatList]: [
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
      action: () => null,
    },
    {
      id: 'chatListSettings',
      label: 'Account & Settings',
      icon: '',
      action: () => null,
    },
  ],
  [manualEncryptionScreenRoutes.home]: [
    {
      id: 'homeSearch',
      label: 'Search',
      icon: '',
      action: () => null,
    },
    {
      id: 'homeSettings',
      label: 'Settings',
      icon: '',
      action: () => null,
    },
    {
      id: 'homeStorage',
      label: 'Storage',
      icon: '',
      action: () => null,
    },
    {
      id: 'homeCreateDocument',
      label: 'Create Document',
      icon: '',
      action: () => null,
    },
  ],
};
