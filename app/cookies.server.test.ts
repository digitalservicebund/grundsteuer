process.env.FORM_COOKIE_SECRET = "secret";

import { createFormDataCookieName } from "~/cookies.server";
import { SessionUser } from "~/auth.server";

jest.mock("~/util/useSecureCookie", () => {
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
