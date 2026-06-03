import {EChatVariants} from '../../app/store/state/chat-rooms-content/chat-rooms-state.types';
import {ISecurePlaceData} from '../../types/encrypt.types';

export interface ICreateRoomFormValues {
  chatName: string;
  chatType: EChatVariants;
  participiantEmails: string[];
  password: string;
  availabilityAreaData: ISecurePlaceData | {};
  availabilityAreaRadius: string;
}
