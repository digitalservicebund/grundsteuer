import { createCipheriv, createDecipheriv, randomBytes } from "node:crypto";

const keyVersion = Buffer.from("v01");
const keyVersionLength = keyVersion.length;
const ALGORITHM = "aes-256-gcm";
const IV_LENGTH = 16;
const AUTH_TAG_LENGTH = 16;

export default (key: string) => {
  return {
    encrypt: (decryptedData: Buffer) => {
      const iv = randomBytes(IV_LENGTH);

      const cipher = createCipheriv(ALGORITHM, key, iv);

      return Buffer.concat([
        keyVersion,
        iv,
        cipher.update(decryptedData),
        cipher.final(),
        cipher.getAuthTag(),
      ]);
    },
    decrypt: (encryptedData: Buffer) => {
      // ignoring key version for now since no key rotation is implemented
      const iv = encryptedData.subarray(
        keyVersionLength,
        IV_LENGTH + keyVersionLength
      );
      const ciphertext = encryptedData.subarray(
        IV_LENGTH + keyVersionLength,
        -AUTH_TAG_LENGTH
      );
      const authTag = encryptedData.subarray(-AUTH_TAG_LENGTH);

      const decipher = createDecipheriv(ALGORITHM, key, iv).setAuthTag(authTag);

      return Buffer.concat([decipher.update(ciphertext), decipher.final()]);
    },
  };
};
