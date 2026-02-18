import {IChatRoom} from '../../../state/chat-rooms-content/chat-rooms-state.types';

export const transformUserData = (apiUser: any, token: string) => ({
  id: apiUser.id,
  role: apiUser.role,
  created: apiUser.created,
  isOnboardingDone: apiUser.user_info?.is_onboarding_done as boolean,
  email: apiUser.email,
  token: token || '',
  portraitUri: apiUser.user_info?.portrait_uri as string,
  title: apiUser.user_info?.title as string,
  phoneNumber: apiUser.user_info?.phone_number as string,
  securePlaces: apiUser.user_info?.data_secrets?.securePlaces || null,
});

export const transformChatAccountData = (
  userChatAccountData: any,
  email: string,
  privateChatKey: string,
) => ({
  email,
  interlocutorId: userChatAccountData?.interlocutor_id,
  chatAccountId: userChatAccountData?.chat_account_id,
  created: userChatAccountData?.created,
  updated: userChatAccountData?.updated,
  invitations: userChatAccountData?.invitations,
  publicChatKey: userChatAccountData?.public_chat_key,
  privateChatKey,
});

export const transformChatRooms = (
  chatRooms: any[],
): Record<string, IChatRoom> =>
  chatRooms.reduce(
    (acc, room) => ({
      ...acc,
      [room.id]: {
        id: room.id,
        password: '',
        chatName: room.chat_name,
        chatType: room.chat_type,
        ownerId: room.owner_id,
        moderatorIds: room.moderator_ids,
        usersData: room.users_data,
        invitedUserIds: room.invited_user_ids,
        messageDurationHours: room.message_duration_hours,
        chatMediaStorageUrl: room.chat_media_storage_url,
        chatIconUrl: room.chat_icon_url,
        availabilityAreaData: room.availability_area_data,
        messages: room.messages || [],
      },
    }),
    {},
  );
