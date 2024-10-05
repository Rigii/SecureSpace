import {ETitleForm} from '../../app/types/encrypt.types';
import {strings} from '../../constants/strings/onboarding.strings';

export const radioButtonsData = [
  {
    id: `title${ETitleForm.mister}`,
    label: strings.mister,
    value: ETitleForm.mister,
  },
  {
    id: `title${ETitleForm.missis}`,
    label: strings.missis,
    value: ETitleForm.missis,
  },
  {
    id: `title${ETitleForm.other}`,
    label: strings.other,
    value: ETitleForm.other,
  },
];
