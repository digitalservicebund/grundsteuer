import {
  COOKIE_ENCODING,
  createFormDataCookieName,
  decryptCookie,
  encryptCookie,
} from "~/storage/cookies.server";
import { SessionUser } from "~/auth.server";

jest.mock("~/storage/useSecureCookie", () => {
  return {
    __esModule: true,
    useSecureCookie: true,
  };
});

const user = { id: "64914671-b3bb-4525-9494-ed44b55cc7e0" } as SessionUser;

describe("createFormDataCookieName", () => {
  it("returns correct cookie name", async () => {
    const name = createFormDataCookieName({
      userId: user.id,
      index: 0,
    });
    expect(name).toEqual("__Host-form_data_0_63fb3253359ff6846283186985aa18c4");
  });
});

describe("encryptCookie / decryptCookie", () => {
  it("changes the given data", () => {
    const input = { value: "secret" };
    const result = encryptCookie(input);
    expect(result).not.toContain("value");
    expect(result).not.toContain("secret");
  });

  it("can be decrypted correctly", () => {
    const input = { value: "secret" };
    const encrypted = encryptCookie(input);
    const decrypted = decryptCookie(Buffer.from(encrypted, COOKIE_ENCODING));
    expect(decrypted).toEqual(input);
  });
});
