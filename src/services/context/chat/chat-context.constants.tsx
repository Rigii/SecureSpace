export const socketEvents = {
  CONNECT: 'connect',
  DISCONNECT: 'disconnect',
  NEW_MESSAGE: 'newMessage',
  ERROR: 'error',
  USER_CHAT_INVITATION: 'user_chat_invitation',
  CHAT_ROOM_MESSAGE: 'chat_room_message',
  USER_JOINED_CHAT: 'user_joined_chat',
  USER_LEFT_CHAT: 'user_left_chat',
};

export const socketMessageNamespaces = {
  CREATE_CHAT: 'create_chat',
  UPDATE_CHAT_OPTIONS: 'update_chat_options',
  INVITE_CHAT_PARTICIPIANTS: 'invite_chat_participiants',
  ADD_CHAT_PARTICIPIANTS: 'add_chat_participiants',
  FIND_ALL_USER_CHAT_ROOMS: 'find_all_user_chats',
  DELETE_CHAT: 'DELETE_CHAT',
  JOIN_CHAT: 'join_chat',
  SEND_MESSAGE: 'send_message',
  LEAVE_CHAT: 'leave_chat',
};
