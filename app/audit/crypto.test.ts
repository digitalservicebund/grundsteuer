import * as crypto from "crypto";
import {
  decryptData,
  decryptSym,
  decryptWithPrivateKey,
  encryptData,
  encryptSym,
  encryptWithPublicKey,
} from "~/audit/crypto";
import * as fs from "fs";
import { Buffer } from "buffer";

const PUBLIC_KEY = Buffer.from(
  fs.readFileSync("test/resources/audit/public.pem", { encoding: "utf-8" })
);
const PRIVATE_KEY = Buffer.from(
  fs.readFileSync("test/resources/audit/private.pem", { encoding: "utf-8" })
);

describe("symmetric encprytion", () => {
  it("should produce correct ciphertext", () => {
    const key = crypto.randomBytes(16);
    const message = "burn after reading";

    const ciphertext = encryptSym(key, message);
    expect(ciphertext).not.toEqual(message);

    const deciphered = decryptSym(key, ciphertext);

    expect(deciphered).toEqual(message);
  });

  it("should fail if hmac is tampered with", () => {
    const key = crypto.randomBytes(16);
    const message = "burn after reading";

    const ciphertext = encryptSym(key, message);
    expect(ciphertext).not.toEqual(message);

    const first5Chars = ciphertext.slice(0, 5);
    const tamperedCiphertext = "vwxyz" + ciphertext.slice(5);

    expect(() => decryptSym(key, tamperedCiphertext)).toThrow();

    const repairedCiphertext = first5Chars + tamperedCiphertext.slice(5);
    expect(decryptSym(key, repairedCiphertext)).toEqual(message);
  });
});

describe("asymmetric encryption", () => {
  it("should produce correct ciphertext", () => {
    const plaintext = "super secret message";

    const ciphertext = encryptWithPublicKey(PUBLIC_KEY, plaintext);
    const decrypted = decryptWithPrivateKey(PRIVATE_KEY, ciphertext);

    expect(decrypted).toEqual(plaintext);
  });

  it("should not produce ciphertext decryptable with public key", () => {
    const plaintext = "super secret message";

    const ciphertext = encryptWithPublicKey(PUBLIC_KEY, plaintext);

    const decryptWithPublicKey = () => {
      return crypto
        .publicDecrypt(PUBLIC_KEY, Buffer.from(ciphertext, "hex"))
        .toString("utf-8");
    };
    expect(() => decryptWithPublicKey()).toThrow();
  });
});

describe("encryptData", () => {
  it("should encrypt small data correctly", () => {
    const plaintext = "boo!";

    const encrypted = encryptData(plaintext, PUBLIC_KEY);
    expect(encrypted).not.toEqual(plaintext);

    const decrypted = decryptData(encrypted, PRIVATE_KEY);
    expect(decrypted).toEqual(plaintext);
  });

  it("should encrypt large data correctly", () => {
    const plaintext = "super secret message".repeat(500);

    const encrypted = encryptData(plaintext, PUBLIC_KEY);
    expect(encrypted).not.toEqual(plaintext);

    const decrypted = decryptData(encrypted, PRIVATE_KEY);
    expect(decrypted).toEqual(plaintext);
  });

  it("should prepend encryption scheme version", () => {
    const plaintext = "super secret message";

    const encrypted = encryptData(plaintext, PUBLIC_KEY);

    expect(encrypted.slice(0, 2)).toEqual("01");
  });
});
