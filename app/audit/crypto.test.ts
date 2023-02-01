import * as crypto from "crypto";
import {
  AuditLogScheme,
  decryptData,
  decryptSym,
  decryptWithPrivateKey,
  encryptData,
  encryptSym,
  encryptWithPublicKey,
  hash,
} from "~/audit/crypto";
import * as fs from "fs";
import { Buffer } from "buffer";

const PRIVATE_KEY_V1 = Buffer.from(
  fs.readFileSync("test/resources/audit/private.pem", { encoding: "utf-8" })
);
const PUBLIC_KEY_V2 = Buffer.from(
  fs.readFileSync("test/resources/audit/public-v2.pem", { encoding: "utf-8" })
);
const PRIVATE_KEY_V2 = Buffer.from(
  fs.readFileSync("test/resources/audit/private-v2.pem", { encoding: "utf-8" })
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

  it("should fail if iv is tampered with", () => {
    const key = crypto.randomBytes(16);
    const message = "burn after reading";

    const ciphertext = encryptSym(key, message);
    const [iv, encryptedData, authTag] = ciphertext.split(":");
    const tamperedIv = iv.slice(0, -5) + "a".repeat(5);
    const tamperedCiphertext = [tamperedIv, encryptedData, authTag].join(":");

    expect(() => decryptSym(key, tamperedCiphertext)).toThrow();

    const reconstructedCiphertext = [iv, encryptedData, authTag].join(":");
    expect(decryptSym(key, reconstructedCiphertext)).toEqual(message);
  });

  it("should fail if authTag is tampered with", () => {
    const key = crypto.randomBytes(16);
    const message = "burn after reading";

    const ciphertext = encryptSym(key, message);
    const [iv, encryptedData, authTag] = ciphertext.split(":");
    const tamperedAuthTag = authTag.slice(0, -5) + "a".repeat(5);
    const tamperedCiphertext = [iv, encryptedData, tamperedAuthTag].join(":");

    expect(() => decryptSym(key, tamperedCiphertext)).toThrow();

    const reconstructedCiphertext = [iv, encryptedData, authTag].join(":");
    expect(decryptSym(key, reconstructedCiphertext)).toEqual(message);
  });

  it("should fail if encryptedData is tampered with", () => {
    const key = crypto.randomBytes(16);
    const message = "burn after reading";

    const ciphertext = encryptSym(key, message);
    const [iv, encryptedData, authTag] = ciphertext.split(":");
    const tamperedEcnryptedData = encryptedData.slice(0, -5) + "a".repeat(5);
    const tamperedCiphertext = [iv, tamperedEcnryptedData, authTag].join(":");

    expect(() => decryptSym(key, tamperedCiphertext)).toThrow();

    const reconstructedCiphertext = [iv, encryptedData, authTag].join(":");
    expect(decryptSym(key, reconstructedCiphertext)).toEqual(message);
  });
});

describe("asymmetric encryption", () => {
  it("should produce correct ciphertext", () => {
    const plaintext = "super secret message";

    const ciphertext = encryptWithPublicKey(PUBLIC_KEY_V2, plaintext);
    expect(ciphertext).not.toEqual(plaintext);

    const decrypted = decryptWithPrivateKey(PRIVATE_KEY_V2, ciphertext);
    expect(decrypted).toEqual(plaintext);
  });

  it("should not produce ciphertext decryptable with public key", () => {
    const plaintext = "super secret message";

    const ciphertext = encryptWithPublicKey(PUBLIC_KEY_V2, plaintext);

    const decryptWithPublicKey = () => {
      return crypto
        .publicDecrypt(PUBLIC_KEY_V2, Buffer.from(ciphertext, "hex"))
        .toString("utf-8");
    };
    expect(() => decryptWithPublicKey()).toThrow();
  });
});

describe("encryptData", () => {
  it("should encrypt v1 data correctly", () => {
    const plaintext = "boo!";

    const encrypted = encryptData(plaintext, AuditLogScheme.V1);
    expect(encrypted).not.toEqual(plaintext);

    const decrypted = decryptData(encrypted, PRIVATE_KEY_V1);
    expect(decrypted).toEqual(plaintext);
  });

  it("should encrypt v2 data correctly", () => {
    const plaintext = "boo!";

    const encrypted = encryptData(plaintext, AuditLogScheme.V2);
    expect(encrypted).not.toEqual(plaintext);

    const decrypted = decryptData(encrypted, PRIVATE_KEY_V2);
    expect(decrypted).toEqual(plaintext);
  });

  it("should encrypt large data correctly", () => {
    const plaintext = "super secret message".repeat(500);

    const encrypted = encryptData(plaintext, AuditLogScheme.V2);
    expect(encrypted).not.toEqual(plaintext);

    const decrypted = decryptData(encrypted, PRIVATE_KEY_V2);
    expect(decrypted).toEqual(plaintext);
  });

  it("should prepend encryption scheme version", () => {
    const plaintext = "super secret message";

    const encrypted = encryptData(plaintext, AuditLogScheme.V2);

    expect(encrypted.slice(0, 2)).toEqual("02");
  });

  it("should not generate identical ciphertext on identical input", () => {
    const plaintext = "boo!";

    const encryptedDataFirstTime = encryptData(plaintext, AuditLogScheme.V2);
    const encryptedDataSecondTime = encryptData(plaintext, AuditLogScheme.V2);

    expect(encryptedDataFirstTime).not.toEqual(encryptedDataSecondTime);
  });
});

describe("hash", () => {
  it("should generate SHA-256 hash", () => {
    const plaintext = "boo!";

    const hashed = hash(plaintext);
    expect(hashed).toEqual(
      "dba7744f3086677fef3e3f281e7a5e567315cd53d4facd66f54cad065227f38e"
    );
  });
});
