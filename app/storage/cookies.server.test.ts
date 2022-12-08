import { getMachine } from "~/routes/__infoLayout/pruefen/_step";
import {
  COOKIE_ENCODING,
  createFormDataCookieName,
  decryptCookie,
  encryptCookie,
  getFromPruefenStateCookie,
  saveToPruefenStateCookie,
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

describe("saveToPruefenStateCookie / getFromPruefenStateCookie", () => {
  it("encodes/decodes correctly", async () => {
    const state = getMachine({ formData: {} }).getInitialState("start");
    const encodedCookie = await saveToPruefenStateCookie(state);
    const decodedCookie = await getFromPruefenStateCookie(encodedCookie);
    expect(decodedCookie.value).toEqual(state.value);
    expect(decodedCookie.context).toEqual(state.context);
  });
});
