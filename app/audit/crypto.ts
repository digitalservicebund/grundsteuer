import * as crypto from "crypto";
import { Buffer } from "buffer";

/*
 * The decryption functions in this file serve only as as PoC for audit log decrytion performed
 * by the auditor externally. They are not intended for invokation by the app in production as the app
 * will not have access to the private key.
 */

const ALGORITHM = "aes-128-cbc";
const HMAC_ALGORITHM = "sha256";
const INPUT_ENCODING = "utf-8";
const OUTPUT_ENCODING = "hex";
const CIPHER_BLOCK_SIZE = 16;
const SYM_SEPARATOR = ":";
const ASYM_SEPARATOR = "|";

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
    SYM_SEPARATOR
  );

  const hmac = crypto.createHmac(HMAC_ALGORITHM, macKey);
  hmac.update(ivAndEncryptedText, INPUT_ENCODING);

  return [ivAndEncryptedText, hmac.digest(OUTPUT_ENCODING)].join(SYM_SEPARATOR);
};

/**
 * Decrypts an encrypted text using AES.
 *
 * @param key 32 bytes, musst be the same key used to encrypt
 * @param ciphertext iv, encrypted text and HMAC, each encoded in OUTPUT_ENCODING
 * @return {string} the decrypted plaintext
 */
export const decryptSym = (key: Buffer, ciphertext: string) => {
  const [encodedIv, encryptedText, authTag] = ciphertext.split(SYM_SEPARATOR);
  const iv = Buffer.from(encodedIv, OUTPUT_ENCODING);
  const encKey = key.slice(0, 16);
  const macKey = key.slice(16);

  const hmac = crypto.createHmac(HMAC_ALGORITHM, macKey);
  hmac.update([encodedIv, encryptedText].join(SYM_SEPARATOR), INPUT_ENCODING);

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

export const encryptWithPublicKey = (publicKey: Buffer, plaintext: string) => {
  return crypto
    .publicEncrypt(
      {
        key: publicKey,
        padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
      },
      Buffer.from(plaintext, INPUT_ENCODING)
    )
    .toString(OUTPUT_ENCODING);
};

export const decryptWithPrivateKey = (
  privateKey: Buffer,
  encrypted: string
) => {
  return crypto
    .privateDecrypt(privateKey, Buffer.from(encrypted, OUTPUT_ENCODING))
    .toString(INPUT_ENCODING);
};

/**
 * Encrypts the plaintext data using a randomly generated secure symmetric key, encrypts this key
 * with the given RSA public key, and returns both values in hex encoding separated by ASYM_SEPARATOR.
 *
 * @param data the plaintext data to encrypt
 * @param publicKey an RSA public key in PEM format
 * @return {string} hex-encoded encrypted symmetric key + ASYM_SEPARATOR + hex-encoded encrypted data
 */
export const encryptData = (data: string, publicKey: Buffer) => {
  const symKey = crypto.randomBytes(CIPHER_BLOCK_SIZE * 2);
  const encryptedData = encryptSym(symKey, data);
  const encryptedSymKey = encryptWithPublicKey(
    publicKey,
    symKey.toString(OUTPUT_ENCODING)
  );

  return [encryptedSymKey, encryptedData].join(ASYM_SEPARATOR);
};

/**
 * Decrypts the data encrypted with {@link encryptData} using the corresponding private key.
 *
 * @param encryptedBlock hex-encoded encrypted symmetric key + ASYM_SEPARATOR + hex-encoded encrypted data
 * @param privateKey the RSA private key for the public key used to encrypt data
 * @return {string} plaintext data
 */
export const decryptData = (encryptedBlock: string, privateKey: Buffer) => {
  const [encryptedSymKey, encryptedData] = encryptedBlock.split(ASYM_SEPARATOR);

  const symKey = Buffer.from(
    decryptWithPrivateKey(privateKey, encryptedSymKey),
    OUTPUT_ENCODING
  );
  return decryptSym(symKey, encryptedData);
};
