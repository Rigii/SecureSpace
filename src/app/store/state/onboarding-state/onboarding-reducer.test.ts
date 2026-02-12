import {IOnboardingFormValues} from './onboarding-state.types';
import onboardingFormSlice, {
  resetForm,
  updateFormField,
} from './onboarding.slice';

describe('Onboarding Form Slice', () => {
  let initialState: IOnboardingFormValues;

  beforeEach(() => {
    initialState = {
      name: '',
      titleForm: '',
      imergencyPasswordsEmails: [{email: '', password: ''}],
      securePlaceName: '',
      securePlaceData: {
        id: '',
        address: '',
        coordinates: {
          lat: '',
          long: '',
        },
      },
      securePlaceRadius: '',
      keyPassword: '',
      confirmKeyPassword: '',
      saveKeyOnDevice: false,
    };
  });

  describe('updateFormField', () => {
    it('should update a string field', () => {
      const nextState = onboardingFormSlice(
        initialState,
        updateFormField({field: 'name', value: 'John Doe'}),
      );

      expect(nextState.name).toBe('John Doe');
      expect(nextState.titleForm).toBe(''); // Other fields unchanged
    });

    it('should update securePlaceData object', () => {
      const securePlaceData = {
        id: 'place-123',
        address: '123 Main St',
        coordinates: {
          lat: '40.7128',
          long: '-74.0060',
        },
      };

      const nextState = onboardingFormSlice(
        initialState,
        updateFormField({field: 'securePlaceData', value: securePlaceData}),
      );

      expect(nextState.securePlaceData).toEqual(securePlaceData);
      expect(nextState.securePlaceData.coordinates.lat).toBe('40.7128');
      expect(nextState.securePlaceData.coordinates.long).toBe('-74.0060');
    });

    it('should update imergencyPasswordsEmails array', () => {
      const emergencyData = [
        {email: 'emergency1@test.com', password: 'pass123'},
        {email: 'emergency2@test.com', password: 'pass456'},
      ];

      const nextState = onboardingFormSlice(
        initialState,
        updateFormField({
          field: 'imergencyPasswordsEmails',
          value: emergencyData,
        }),
      );

      expect(nextState.imergencyPasswordsEmails).toHaveLength(2);
      expect(nextState.imergencyPasswordsEmails[0].email).toBe(
        'emergency1@test.com',
      );
      expect(nextState.imergencyPasswordsEmails[1].password).toBe('pass456');
    });

    it('should update boolean field', () => {
      const nextState = onboardingFormSlice(
        initialState,
        updateFormField({field: 'saveKeyOnDevice', value: true}),
      );

      expect(nextState.saveKeyOnDevice).toBe(true);
    });

    it('should update multiple fields sequentially', () => {
      let state = onboardingFormSlice(
        initialState,
        updateFormField({field: 'name', value: 'John Doe'}),
      );

      state = onboardingFormSlice(
        state,
        updateFormField({field: 'titleForm', value: 'Mr.'}),
      );
      state = onboardingFormSlice(
        state,
        updateFormField({field: 'securePlaceRadius', value: '500m'}),
      );
      expect(state.name).toBe('John Doe');
      expect(state.titleForm).toBe('Mr.');
      expect(state.securePlaceRadius).toBe('500m');
    });
    it('should handle empty string updates', () => {
      const populatedState = {
        ...initialState,
        name: 'John Doe',
        securePlaceRadius: '500m',
      };

      const nextState = onboardingFormSlice(
        populatedState,
        updateFormField({field: 'name', value: ''}),
      );

      expect(nextState.name).toBe('');
      expect(nextState.securePlaceRadius).toBe('500m'); // Other fields unchanged
    });

    it('should preserve other fields when updating one field', () => {
      const populatedState = {
        ...initialState,
        name: 'John Doe',
        keyPassword: 'secret123',
      };

      const nextState = onboardingFormSlice(
        populatedState,
        updateFormField({field: 'name', value: 'Jane Doe'}),
      );

      expect(nextState.name).toBe('Jane Doe');
      expect(nextState.keyPassword).toBe('secret123'); // Preserved
      expect(nextState.confirmKeyPassword).toBe(''); // Other fields unchanged
    });
  });

  describe('resetForm', () => {
    it('should reset all fields to initial state', () => {
      const populatedState = {
        name: 'John Doe',
        titleForm: 'Mr.',
        imergencyPasswordsEmails: [
          {email: 'test@test.com', password: 'pass123'},
          {email: 'test2@test.com', password: 'pass456'},
        ],
        securePlaceName: 'Home',
        securePlaceData: {
          id: 'place-123',
          address: '123 Main St',
          coordinates: {
            lat: '40.7128',
            long: '-74.0060',
          },
        },
        securePlaceRadius: '500m',
        keyPassword: 'key123',
        confirmKeyPassword: 'key123',
        saveKeyOnDevice: true,
      };

      const nextState = onboardingFormSlice(populatedState, resetForm());

      expect(nextState).toEqual(initialState);
      expect(nextState.name).toBe('');
      expect(nextState.imergencyPasswordsEmails).toEqual([
        {email: '', password: ''},
      ]);
      expect(nextState.saveKeyOnDevice).toBe(false);
    });

    it('should reset from partially filled state', () => {
      const partiallyFilledState = {
        ...initialState,
        name: 'John Doe',
        securePlaceRadius: '500m',
      };

      const nextState = onboardingFormSlice(partiallyFilledState, resetForm());

      expect(nextState).toEqual(initialState);
    });

    it('should reset from already empty state', () => {
      const nextState = onboardingFormSlice(initialState, resetForm());

      expect(nextState).toEqual(initialState);
    });
  });

  describe('Immer.js mutation behavior', () => {
    it('should not mutate original state when updating', () => {
      const originalState = {...initialState};

      onboardingFormSlice(
        originalState,
        updateFormField({field: 'name', value: 'John Doe'}),
      );

      expect(originalState.name).toBe(''); // Original unchanged
    });

    it('should create new object references for updated fields', () => {
      const originalState = {...initialState};

      const nextState = onboardingFormSlice(
        originalState,
        updateFormField({
          field: 'securePlaceData',
          value: {
            id: '123',
            address: 'Test',
            coordinates: {lat: '1', long: '2'},
          },
        }),
      );

      expect(nextState.securePlaceData).not.toBe(originalState.securePlaceData);
      expect(nextState).not.toBe(originalState);
    });
  });

  describe('Edge cases', () => {
    it('should handle updating with same value', () => {
      const stateWithValue = {
        ...initialState,
        name: 'John Doe',
      };

      const nextState = onboardingFormSlice(
        stateWithValue,
        updateFormField({field: 'name', value: 'John Doe'}),
      );

      expect(nextState.name).toBe('John Doe');
      // Should still work without errors
    });

    it('should handle updating imergencyPasswordsEmails with empty array', () => {
      const nextState = onboardingFormSlice(
        initialState,
        updateFormField({field: 'imergencyPasswordsEmails', value: []}),
      );

      expect(nextState.imergencyPasswordsEmails).toEqual([]);
    });

    it('should handle updating coordinates partially', () => {
      const nextState = onboardingFormSlice(
        initialState,
        updateFormField({
          field: 'securePlaceData',
          value: {
            ...initialState.securePlaceData,
            coordinates: {
              lat: '40.7128',
              long: '',
            },
          },
        }),
      );

      expect(nextState.securePlaceData.coordinates.lat).toBe('40.7128');
      expect(nextState.securePlaceData.coordinates.long).toBe('');
    });
  });

  // Optional: Test type safety (these are compile-time checks)
  describe('TypeScript type safety', () => {
    it('should only accept valid field names', () => {
      // @ts-expect-error - invalid field
      updateFormField({field: 'invalidField', value: 'test'});

      // @ts -expect-error - wrong value type for field
      updateFormField({field: 'saveKeyOnDevice', value: 'not-boolean'});

      // These should compile:
      updateFormField({field: 'name', value: 'test'});
      updateFormField({field: 'saveKeyOnDevice', value: true});
    });
  });
});
