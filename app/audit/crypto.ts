import * as crypto from "crypto";
import { Buffer } from "buffer";

const ALGORITHM = "aes-128-cbc";
const HMAC_ALGORITHM = "sha256";
const INPUT_ENCODING = "utf-8";
const OUTPUT_ENCODING = "hex";
const CIPHER_BLOCK_SIZE = 16;

/**
 * Encrypts the given plaintext using AES.
 *
 * @param key random key, must be 32 bytes
 * @param plaintext the text to encrypt
 * @return {string} colon-separated iv, encrypted text and HMAC, each encoded in OUTPUT_ENCODING
 */
export const encryptSym = (key: Buffer, plaintext: string) => {
  const iv = crypto.randomBytes(CIPHER_BLOCK_SIZE);
  const encKey = key.slice(0, CIPHER_BLOCK_SIZE);
  const macKey = key.slice(CIPHER_BLOCK_SIZE);

  const cipher = crypto.createCipheriv(ALGORITHM, encKey, iv);
  let encryptedText = cipher.update(plaintext, INPUT_ENCODING, OUTPUT_ENCODING);
  encryptedText += cipher.final(OUTPUT_ENCODING);
  const ivAndEncryptedText = [iv.toString(OUTPUT_ENCODING), encryptedText].join(
    ":"
  );

  const hmac = crypto.createHmac(HMAC_ALGORITHM, macKey);
  hmac.update(ivAndEncryptedText, "utf-8");

  return [ivAndEncryptedText, hmac.digest(OUTPUT_ENCODING)].join(":");
};

/**
 * Decrypts an encrypted text using AES.
 *
 * @param key 32 bytes, musst be the same key used to encrypt
 * @param ciphertext iv, encrypted text and HMAC, each encoded in OUTPUT_ENCODING
 * @return {string} the decrypted plaintext
 */
export const decryptSym = (key: Buffer, ciphertext: string) => {
  const [encodedIv, encryptedText, authTag] = ciphertext.split(":");
  const iv = Buffer.from(encodedIv, OUTPUT_ENCODING);
  const encKey = key.slice(0, 16);
  const macKey = key.slice(16);

  const hmac = crypto.createHmac(HMAC_ALGORITHM, macKey);
  hmac.update([encodedIv, encryptedText].join(":"), "utf-8");

  if (!authTag || hmac.digest(OUTPUT_ENCODING) !== authTag) {
    throw new Error("Message authentication failed.");
  }

  const decipher = crypto.createDecipheriv(ALGORITHM, encKey, iv);
  let plaintext = decipher.update(
    encryptedText,
    OUTPUT_ENCODING,
    INPUT_ENCODING
  );
  plaintext += decipher.final(INPUT_ENCODING);
  return plaintext;
};
