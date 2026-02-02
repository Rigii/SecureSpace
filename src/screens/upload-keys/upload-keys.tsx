import React from 'react';
import {Keyboard, TouchableWithoutFeedback, View} from 'react-native';
import {Title1, Title3} from '../../components/text-titles/title';
import {strings} from './upload-keys.string';
import {Input, KeyboardTypes} from '../../components/input';
import {ThemedButton} from '../../components/themed-button';
// import {
//   EKeychainSecrets,
//   getSecretKeychain,
// } from '../../services/secrets-keychains/store-secret-keychain';
import {useReduxSelector} from '../../app/store/store';
import {
  EPopupType,
  ErrorNotificationHandler,
} from '../../services/error-notification-handler';
import {
  NavigationProp,
  RouteProp,
  useNavigation,
  useRoute,
} from '@react-navigation/native';
import {
  RootStackParamList,
  applicationRoutes,
} from '../../app/navigator/screens';
import {useDispatch} from 'react-redux';
import OpenPGP from 'react-native-fast-openpgp';

import {addPgpDeviceKeyData} from '../../app/store/state/userState/userAction';
import {IDeviceKeyData} from '../../app/store/state/userState/userState.types';
import DocumentPicker from 'react-native-document-picker';
import RNFS from 'react-native-fs';
import {decryptPrivateKeyBlock} from '../../services/pgp-encryption-service/encrypt-pkey-block';
import {
  EKeychainSecrets,
  storeSecretKeychain,
} from '../../services/secrets-keychains/store-secret-keychain';

export const UploadKey = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const route = useRoute<RouteProp<RootStackParamList, 'uploadKey'>>();

  const {publicKey, keyRecordId, keyRecordDate, keyType} = route.params;

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
    navigation.navigate(applicationRoutes.accountSettings);

  const pickPrivateKeyFile = async (): Promise<string | null> => {
    try {
      const res = await DocumentPicker.pickSingle({
        type: [DocumentPicker.types.plainText, DocumentPicker.types.allFiles],
        copyTo: 'cachesDirectory',
      });

      const fileUri = res.fileCopyUri ?? res.uri;

      if (!fileUri) {
        throw new Error('Cannot access selected file');
      }

      const content = await RNFS.readFile(
        fileUri.replace('file://', ''),
        'utf8',
      );

      return content;
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        return null;
      }
      throw err;
    }
  };

  const checkPrivatePublicKeysCompatabillity = async ({
    thisPublicKey,
    privateKey,
  }: {
    thisPublicKey: string;
    privateKey: string;
  }) => {
    const publicKeyMetadata = await OpenPGP.getPublicKeyMetadata(thisPublicKey);
    const privateKeyMetadata = await OpenPGP.getPrivateKeyMetadata(privateKey);

    return publicKeyMetadata.keyID === privateKeyMetadata.keyID;
  };

  const onSubmit = async () => {
    try {
      const keyFileData = await pickPrivateKeyFile();
      if (!keyFileData) {
        throw new Error(strings.noDeviceKeyData);
      }
      const decryptedData = await decryptPrivateKeyBlock({
        encryptedData: keyFileData || '',
        password: keyPassword,
        email,
        keyUuid: keyRecordId,
      });

      const compatiblePublicKeyData =
        (await checkPrivatePublicKeysCompatabillity({
          privateKey: decryptedData.privateKey,
          thisPublicKey: publicKey,
        }))
          ? publicKey
          : null;

      if (!compatiblePublicKeyData) {
        return;
      }

      const newPgpDeviceKeyData = {
        ...pgpDeviceKeyData,
        devicePrivateKey: decryptedData.privateKey,
        keyUUID: keyRecordId,
        date: keyRecordDate,
        email: email,
        approved: true,
      } as unknown as IDeviceKeyData;

      await storeSecretKeychain({
        email,
        password: keyPassword,
        uuid: keyRecordId,
        privateKey: decryptedData.privateKey,
        type: EKeychainSecrets.devicePrivateKey,
      });

      dispatch(addPgpDeviceKeyData(newPgpDeviceKeyData));

      navigation.navigate(applicationRoutes.root);
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

  const pageData = {
    pageHeader:
      keyType === 'chat' ? strings.uploadYourChatKey : strings.uploadYourAppKey,
    pageDescription:
      keyType === 'chat'
        ? strings.toUseSecureChatRoomKeys
        : strings.toUseSecureDataUploadKeys,
  };

  return (
    <TouchableWithoutFeedback onPress={handleScreenPress}>
      <View className="flex flex-col items-center flex-1 p-3 w-screen">
        <View className="block flex-1 mt-auto items-center justify-center gap-y-5 overflow-scroll">
          <Title1>{pageData.pageHeader}</Title1>
          <Title3>{pageData.pageDescription}</Title3>
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
