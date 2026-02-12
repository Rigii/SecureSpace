import {EChatVariants} from '../../app/store/state/chat-rooms-content/chat-rooms-state.types';

export const radioButtonsData = [
  {
    id: `chat_${EChatVariants.private}`,
    label: 'Private',
    value: EChatVariants.private,
  },
  {
    id: `chat_${EChatVariants.multi}`,
    label: 'Multi',
    value: EChatVariants.multi,
  },
];
