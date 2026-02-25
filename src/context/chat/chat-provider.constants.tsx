/* socket.on */
export const socketEventStatus = {
  CONNECT: 'connect',
  DISCONNECT: 'disconnect',
  ERROR: 'error',
  USER_CHAT_INVITATION: 'user_chat_invitation',
  CHAT_ROOM_MESSAGE: 'chat_room_message',
  ROOM_NOTIFICATION_MESSAGE: 'room_notification_message',
  JOIN_CHAT_SUCCESS: 'join_chat_success',
  JOIN_CHAT_ERROR: 'join_chat_error',
  USER_LEFT_CHAT: 'user_left_chat',
  DELETE_CHAT_ROOM_SUCCESS: 'delete_chat_room_success',
  DELETE_CHAT_ROOM_ERROR: 'delete_chat_room_error',
  DECLINE_CHAT_INVITATION_SUCCESS: 'decline_chat_invitation_success',
  DECLINE_CHAT_INVITATION_ERROR: 'decline_chat_invitation_error',
};

/* socket.emit */
export const socketMessageNamespaces = {
  CHAT_ROOM_MESSAGE: 'chat_room_message',
  CREATE_CHAT: 'create_chat',
  DELETE_CHAT_ROOM: 'delete_chat_room',
  DECLINE_CHAT: 'decline_chat',
  UPDATE_CHAT_OPTIONS: 'update_chat_options',
  INVITE_CHAT_PARTICIPIANTS: 'invite_chat_participiants',
  ADD_CHAT_PARTICIPIANTS: 'add_chat_participiants',
  FIND_ALL_USER_CHAT_ROOMS: 'find_all_user_chats',
  JOIN_ROOM: 'join_room',
  LEAVE_ROOM: 'leave_room',
  JOIN_NEW_ROOM: 'join_new_room',
  SEND_MESSAGE: 'send_message',
  UNSUBSCRIBE_ROOM: 'unsubscribe_room',
};
