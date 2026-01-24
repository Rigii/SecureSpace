import React, {createContext} from 'react';
import {useReduxSelector} from '../../app/store/store';
import {
  EKeychainSectets,
  getSecretKeychain,
} from '../../services/secrets-keychains/store-secret-keychain';

export const EncryptionKeysContext = createContext<{}>({});

export const EncryptionKeysProvider: React.FC<{children: React.ReactNode}> = ({
  children,
}) => {
  const {chatAccountId, privateChatKey} = useReduxSelector(
    state => state.userChatAccountReducer,
  );

  const getChatKeyChain = async ({
    email,
    publicChatKey,
  }: {
    email: string;
    publicChatKey: string;
  }) => {
    if (privateChatKey) {
      return privateChatKey;
    }
    if (!chatAccountId || !publicChatKey) {
      return;
    }

    const privatetKey = await getSecretKeychain({
      type: EKeychainSectets.chatPrivateKey,
      encryptKeyDataPassword: '',
      email,
    });

    if (!privatetKey) {
      // navigate to the upload key screen
      return;
    }

    return privatetKey;
  };

  return (
    <EncryptionKeysContext.Provider value={{getChatKeyChain}}>
      {children}
    </EncryptionKeysContext.Provider>
  );
};
