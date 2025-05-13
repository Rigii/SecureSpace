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
// import {useDispatch} from 'react-redux';

export const UploadKey = () => {
  const {email} = useReduxSelector(
    state => state.anonymousUserReducer.userAccountData,
  );
  const [keyPassword, setKeyPassword] = React.useState<string>('');
  const [passwordError, setError] = React.useState<string>('');
  const handleScreenPress = () => {
    Keyboard.dismiss();
  };

  //   const dispatch = useDispatch();
  const onSubmit = async () => {
    try {
      const keysData = await getSecretKeychain({
        type: EKeychainSectets.devicePrivateKey,
        encryptKeyDataPassword: keyPassword,
        email,
      });
      console.log(22222222, keysData);
      //   const {} = keysData;
      //   dispatch()
      setError('');
    } catch (error) {
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
      </View>
    </TouchableWithoutFeedback>
  );
};
