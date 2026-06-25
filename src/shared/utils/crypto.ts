import JSEncrypt from 'jsencrypt';

interface EncryptionKeyData {
  key: string;
  requestId: string;
}

export const encryptString = (data: string, keyData: EncryptionKeyData) => {
  const encrypt = new JSEncrypt();
  encrypt.setPublicKey(keyData.key);
  const encrypted = encrypt.encrypt(data);
  return encrypted ? encrypted : '';
};
