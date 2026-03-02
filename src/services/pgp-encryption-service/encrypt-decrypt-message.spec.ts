import OpenPGP from 'react-native-fast-openpgp';
import {
  encryptSignMessageForMultipleRecipients,
  decryptMessage,
  isEncryptedMessage,
} from './encrypt-decrypt-message';

jest.mock('react-native-fast-openpgp');

const mockedOpenPGP = OpenPGP as jest.Mocked<typeof OpenPGP>;

describe('Crypto Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('encryptSignMessageForMultipleRecipients', () => {
    it('should encrypt and sign when private key is provided', async () => {
      mockedOpenPGP.encrypt.mockResolvedValue('encrypted-data');
      mockedOpenPGP.sign.mockResolvedValue('signature-data');

      const result = await encryptSignMessageForMultipleRecipients({
        publicKeys: ['pub1', 'pub2'],
        userPrivateKey: 'private-key',
        passphrase: 'pass',
        message: 'hello',
      });

      expect(mockedOpenPGP.encrypt).toHaveBeenCalledWith('hello', 'pub1\npub2');

      expect(mockedOpenPGP.sign).toHaveBeenCalledWith(
        'encrypted-data',
        'private-key',
        'pass',
      );

      const parsed = JSON.parse(result);
      expect(parsed.encrypted).toBe('encrypted-data');
      expect(parsed.signature).toBe('signature-data');
    });

    it('should encrypt without signing if no private key provided', async () => {
      mockedOpenPGP.encrypt.mockResolvedValue('encrypted-data');

      const result = await encryptSignMessageForMultipleRecipients({
        publicKeys: ['pub1'],
        message: 'hello',
      });

      expect(mockedOpenPGP.encrypt).toHaveBeenCalled();
      expect(mockedOpenPGP.sign).not.toHaveBeenCalled();

      const parsed = JSON.parse(result);
      expect(parsed.signature).toBeFalsy();
    });
  });

  describe('decryptMessage', () => {
    it('should verify and decrypt message', async () => {
      mockedOpenPGP.verify.mockResolvedValue(true);
      mockedOpenPGP.decrypt.mockResolvedValue('decrypted-message');

      const encryptedPayload = JSON.stringify({
        encrypted: 'encrypted-data',
        signature: 'signature-data',
      });

      const result = await decryptMessage({
        privateKey: 'recipient-private',
        passphrase: 'pass',
        senderPublicKey: 'sender-public',
        encryptedMessage: encryptedPayload,
      });

      expect(mockedOpenPGP.verify).toHaveBeenCalledWith(
        'signature-data',
        'encrypted-data',
        'sender-public',
      );

      expect(mockedOpenPGP.decrypt).toHaveBeenCalledWith(
        'encrypted-data',
        'recipient-private',
        'pass',
      );

      expect(result.message).toBe('decrypted-message');
      expect(result.verifiedOrigin).toBe(true);
    });

    it('should return false verification if signature invalid', async () => {
      mockedOpenPGP.verify.mockResolvedValue(false);
      mockedOpenPGP.decrypt.mockResolvedValue('decrypted-message');

      const encryptedPayload = JSON.stringify({
        encrypted: 'encrypted-data',
        signature: 'bad-signature',
      });

      const result = await decryptMessage({
        privateKey: 'recipient-private',
        passphrase: 'pass',
        senderPublicKey: 'sender-public',
        encryptedMessage: encryptedPayload,
      });

      expect(result.verifiedOrigin).toBe(false);
    });

    it('should throw if encryptedMessage is invalid JSON', async () => {
      await expect(
        decryptMessage({
          privateKey: 'recipient-private',
          passphrase: 'pass',
          senderPublicKey: 'sender-public',
          encryptedMessage: 'not-json',
        }),
      ).rejects.toThrow();
    });
  });

  describe('isEncryptedMessage', () => {
    it('should return true for PGP message', () => {
      const message = '-----BEGIN PGP MESSAGE-----\nabc';
      expect(isEncryptedMessage(message)).toBe(true);
    });

    it('should return false for normal message', () => {
      expect(isEncryptedMessage('hello')).toBe(false);
    });
  });
});
