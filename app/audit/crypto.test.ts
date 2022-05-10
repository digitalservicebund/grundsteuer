import * as crypto from "crypto";
import { decryptSym, encryptSym } from "~/audit/crypto";

describe("symmetric encprytion", () => {
  it("should produce correct ciphertext", () => {
    const key = crypto.randomBytes(32);
    const message = "burn after reading";

    const ciphertext = encryptSym(key, message);

    expect(ciphertext).not.toEqual(message);

    const deciphered = decryptSym(key, ciphertext);

    expect(deciphered).toEqual(message);
  });

  it("should fail if hmac is tampered with", () => {
    const key = crypto.randomBytes(32);
    const message = "burn after reading";

    const ciphertext = encryptSym(key, message);

    expect(ciphertext).not.toEqual(message);

    const last5Chars = ciphertext.slice(-5);
    const tamperedCiphertext = ciphertext.slice(0, -5) + "vwyxz";

    expect(() => decryptSym(key, tamperedCiphertext)).toThrow(
      "Message authentication failed."
    );

    const repairedCiphertext = tamperedCiphertext.slice(0, -5) + last5Chars;
    expect(decryptSym(key, repairedCiphertext)).toEqual(message);
  });
});
