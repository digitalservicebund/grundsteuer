import { createCipheriv, createDecipheriv, randomBytes } from "node:crypto";

const keyVersion = Buffer.from("v01");
const keyVersionLength = keyVersion.length;
const ALGORITHM = "aes-256-gcm";
const IV_LENGTH = 16;
const AUTH_TAG_LENGTH = 16;

type EncryptionFunction = (options: { data: Buffer; key: string }) => Buffer;

export const encrypt: EncryptionFunction = ({ data, key }) => {
  const iv = randomBytes(IV_LENGTH);
  const cipher = createCipheriv(ALGORITHM, key, iv);

  return Buffer.concat([
    keyVersion,
    iv,
    cipher.update(data),
    cipher.final(),
    cipher.getAuthTag(),
  ]);
};

export const decrypt: EncryptionFunction = ({ data, key }) => {
  // ignoring key version for now since no key rotation is implemented
  const iv = data.subarray(keyVersionLength, IV_LENGTH + keyVersionLength);
  const ciphertext = data.subarray(
    IV_LENGTH + keyVersionLength,
    -AUTH_TAG_LENGTH
  );
  const authTag = data.subarray(-AUTH_TAG_LENGTH);
  const decipher = createDecipheriv(ALGORITHM, key, iv).setAuthTag(authTag);

  return Buffer.concat([decipher.update(ciphertext), decipher.final()]);
};
