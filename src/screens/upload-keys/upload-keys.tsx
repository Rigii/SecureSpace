import React from 'react';
import {Keyboard, TouchableWithoutFeedback, View} from 'react-native';
import {Title1, Title3} from '../../components/text-titles/title';
import {strings} from './upload-keys.string';
import {Input, KeyboardTypes} from '../../components/input';
import {ThemedButton} from '../../components/themed-button';
import {
  EKeychainSectets,
  getSecretKeychain,
} from '../../services/secrets-keychains/store-secret-keychain';
import {useReduxSelector} from '../../app/store/store';
import {
  EPopupType,
  ErrorNotificationHandler,
} from '../../services/ErrorNotificationHandler';
import {NavigationProp, useNavigation} from '@react-navigation/native';
import {
  RootStackParamList,
  manualEncryptionScreenRoutes,
} from '../../app/navigator/screens';
import {useDispatch} from 'react-redux';
import {addPgpDeviceKeyData} from '../../app/store/state/userState/userAction';
import {IDeviceKeyData} from '../../app/store/state/userState/userState.types';

export const UploadKey = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const dispatch = useDispatch();

  const {email} = useReduxSelector(
    state => state.anonymousUserReducer.userAccountData,
  );
  const {pgpDeviceKeyData} = useReduxSelector(
    state => state.anonymousUserReducer.securityData,
  );
  const [keyPassword, setKeyPassword] = React.useState<string>('');
  const [passwordError, setError] = React.useState<string>('');
  const handleScreenPress = () => {
    Keyboard.dismiss();
  };

  const navigateSettings = () =>
    navigation.navigate(manualEncryptionScreenRoutes.accountSettings);

  const onSubmit = async () => {
    try {
      const keysData = await getSecretKeychain({
        type: EKeychainSectets.devicePrivateKey,
        encryptKeyDataPassword: keyPassword,
        email,
      });

      if (keysData === null) {
        throw new Error(strings.noDeviceKeyData);
      }
      const newPgpDeviceKeyData = {
        ...pgpDeviceKeyData,
        devicePrivateKey: keysData,
        approved: true,
      } as IDeviceKeyData;

      dispatch(addPgpDeviceKeyData({pgpDeviceKeyData: newPgpDeviceKeyData}));

      navigation.navigate(manualEncryptionScreenRoutes.root);
      setError('');
    } catch (error) {
      console.error(error);
      const currentError = error as Error;
      setError(currentError.message);
      ErrorNotificationHandler({
        type: EPopupType.ERROR,
        text1: currentError.message,
      });
    }
  };

  return (
    <TouchableWithoutFeedback onPress={handleScreenPress}>
      <View className="flex flex-col items-center flex-1 p-3 w-screen">
        <View className="block flex-1 mt-auto items-center justify-center gap-y-5 overflow-scroll">
          <Title1>{strings.uploadYourKeys}</Title1>
          <Title3>{strings.toUseSecureDataUploadKeys}</Title3>
          <View>
            <Input
              value={keyPassword}
              onChange={setKeyPassword}
              placeholder={strings.yourKeyPassword}
              keyboardType={KeyboardTypes.default}
              className="w-80"
              isSecure={true}
              isError={!!passwordError}
            />
          </View>
        </View>
        <ThemedButton
          text={strings.getKey}
          theme="filled"
          onPress={onSubmit}
          classCustomBody="w-80"
        />
        <View className="mt-3">
          <ThemedButton
            text={strings.settings}
            theme="lightBordered"
            onPress={navigateSettings}
          />
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};
