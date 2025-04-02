import {EChatVariants} from '../../app/store/state/chatRoomsContent/chatRoomsState.types';
import {ISecurePlaceData} from '../../app/types/encrypt.types';

export interface ICreateRoomFormValues {
  chatName: string;
  chatType: EChatVariants;
  participiantEmails: string[];
  password: string;
  availabilityAreaData: ISecurePlaceData | {};
  availabilityAreaRadius: string;
}
