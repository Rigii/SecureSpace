declare module 'react-native-openpgp' {
    export function encrypt(message: string, publicKey: string): Promise<string>;
    export function decrypt(encryptedMessage: string, privateKey: string, passphrase: string): Promise<string>;
    export function generateKeyPair(options: {
      name: string;
      email: string;
      passphrase?: string; 
    }): Promise<{ publicKey: string; privateKey: string }>;
    export function generateKey(options: {
      userIds: {
        name: string;
        email: string;
    }[];
    numBits: number;
    passphrase: string;
    }): Promise<{ publicKeyArmored: string; privateKeyArmored: string }>;
  }
