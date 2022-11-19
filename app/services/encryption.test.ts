import encryption from "./encryption";

const KEY = "0123456789_0123456789_0123456789";
const data = Buffer.from("hallo welt!", "utf8");
const encryptedData = encryption(KEY).encrypt(data);

describe("encryption", () => {
  describe("encrypt", () => {
    it("returns encrypted data", () => {
      expect(encryptedData).not.toContain(data);
    });
  });

  describe("decrypt", () => {
    it("returns decrypted data", () => {
      expect(encryption(KEY).decrypt(encryptedData)).toEqual(data);
    });
  });
});
