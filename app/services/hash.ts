import * as crypto from "crypto";

export const hash = (plainText: string) => {
  return crypto.createHash("sha1").update(plainText).digest("hex");
};
