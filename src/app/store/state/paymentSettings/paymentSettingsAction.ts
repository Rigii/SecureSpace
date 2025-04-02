import {createAsyncThunk} from '@reduxjs/toolkit';
import {strings} from '../../../../constants/strings/encryption-decryption.strings';
import {locallyManualEncryptionPaymentSettings} from '../../../../services/async-secure-storage/async-storage-service';
// import {GetApplicationPaymentSettings} from '../../../../utilities/functionsAdapter/functionsAdapter';

const GetMockedApplicationSettings = () => ({
  encryption: {
    id: '123',
    object: '123',
    active: false,
    created: 321213213,
    default_price: 15,
    description: 'test',
    features: [],
    images: [],
    livemode: false,
    metadata: '' as unknown as Record<string, unknown>,
    name: '',
    package_dimensions: null,
    shippable: null,
    statement_descriptor: null,
    tax_code: null,
    unit_label: null,
    updated: 2134234234324,
    url: null,
    default_price_value: '15',
  },
});

export const fetchPaymentSettings = createAsyncThunk(
  'paymentSettings/fetchSettings',
  async (_, thunkAPI) => {
    try {
      const fetchedPaymentSettings = await GetMockedApplicationSettings();
      if (!fetchedPaymentSettings?.encryption) {
        return {};
      }

      fetchedPaymentSettings &&
        locallyManualEncryptionPaymentSettings.set(
          fetchedPaymentSettings.encryption,
        );

      return fetchedPaymentSettings.encryption;
    } catch {
      return thunkAPI.rejectWithValue(strings.gettingPaymentSettingsError);
    }
  },
);
