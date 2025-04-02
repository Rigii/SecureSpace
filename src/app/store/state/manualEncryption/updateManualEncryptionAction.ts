import {createAction} from '@reduxjs/toolkit';
import {IManualEncryptionState} from './types';

export const updateManualEncryptionDataAction = createAction(
  'manualEncryptionData/updateManualEncryptionDataAction',
  (data: Partial<IManualEncryptionState>) => ({
    payload: data,
  }),
);
