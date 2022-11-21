import { encrypt, decrypt } from "./encryption";

const key = "0123456789_0123456789_0123456789";
const data = Buffer.from("hallo welt!", "utf8");
const encryptedData = encrypt({ data, key });

describe("encryption", () => {
  describe("encrypt", () => {
    it("returns encrypted data", () => {
      expect(encryptedData).not.toContain(data);
    });
  });

  describe("decrypt", () => {
    it("returns decrypted data", () => {
      expect(decrypt({ data: encryptedData, key })).toEqual(data);
    });
  });
});
