import {
  getStoredFormData,
  createHeadersWithFormDataCookie,
  createFormDataCookie,
  createFormDataCookieName,
  encryptCookie,
} from "~/formDataStorage.server";
import { SessionUser } from "./auth.server";
import { GrundModel } from "./domain/steps";

jest.mock("~/util/useSecureCookie", () => {
  return {
    __esModule: true,
    useSecureCookie: true,
  };
});

const user = { id: "64914671-b3bb-4525-9494-ed44b55cc7e0" } as SessionUser;

process.env.FORM_COOKIE_SECRET = "secret";
process.env.FORM_COOKIE_ENC_SECRET = "26d011bcbb9db8c4673b7fcd90c9ec6d";

describe("createFormDataCookieName", () => {
  it("returns correct cookie name", async () => {
    const name = createFormDataCookieName({
      userId: user.id,
      index: 0,
    });
    expect(name).toEqual("__Host-form_data_0_63fb3253359ff6846283186985aa18c4");
  });
});

describe("getStoredFormData", () => {
  describe("no cookie present", () => {
    it("returns empty object", async () => {
      const request = new Request("http://localhost/");
      const data = await getStoredFormData({
        request,
        user,
      });
      expect(data).toEqual({});
    });
  });

  describe("no suitable cookie present", () => {
    const cases = [
      {
        description: "wrong index",
        userId: user.id,
        index: 1,
      },
      {
        description: "wrong user",
        userId: "99999999",
        index: 0,
      },
    ];

    test.each(cases)(
      "cookie with $description returns empty object",
      async ({ index, userId }) => {
        const cookie = await createFormDataCookie({
          userId,
          index,
        }).serialize("data");
        const request = new Request("http://localhost/", {
          headers: {
            Cookie: cookie,
          },
        });
        const data = await getStoredFormData({
          request,
          user,
        });
        expect(data).toEqual({});
      }
    );
  });

  describe("authoritive cookie for given user is present", () => {
    describe("user id inside cookie matches given user id", () => {
      it("returns stored data", async () => {
        const data = encryptCookie({
          userId: user.id,
          data: { grundstueck: { typ: { typ: "einfamilienhaus" } } },
        });
        const cookie = await createFormDataCookie({
          userId: user.id,
          index: 0,
        }).serialize("1" + data);
        const request = new Request("http://localhost/", {
          headers: {
            Cookie: cookie,
          },
        });
        const retrievedData = await getStoredFormData({
          request,
          user,
        });
        expect(retrievedData).toEqual({
          grundstueck: { typ: { typ: "einfamilienhaus" } },
        });
      });

      describe("multiple cookies", () => {
        it("returns stored data", async () => {
          const data = encryptCookie({
            userId: user.id,
            data: { grundstueck: { typ: { typ: "einfamilienhaus" } } },
          });
          const cookie = await createFormDataCookie({
            userId: user.id,
            index: 0,
          }).serialize("3" + data.slice(0, 10));
          const cookie2 = await createFormDataCookie({
            userId: user.id,
            index: 1,
          }).serialize(data.slice(10, 20));
          const cookie3 = await createFormDataCookie({
            userId: user.id,
            index: 2,
          }).serialize(data.slice(20));
          const request = new Request("http://localhost/", {
            headers: {
              Cookie: [cookie, cookie2, cookie3].join(";"),
            },
          });
          const retrievedData = await getStoredFormData({
            request,
            user,
          });
          expect(retrievedData).toEqual({
            grundstueck: { typ: { typ: "einfamilienhaus" } },
          });
        });

        describe("a single cookie is missing", () => {
          it("returns empty object", async () => {
            const data = encryptCookie({
              userId: user.id,
              data: { grundstueck: { typ: { typ: "einfamilienhaus" } } },
            });
            const cookie = await createFormDataCookie({
              userId: user.id,
              index: 0,
            }).serialize("3" + data.slice(0, 9));
            const cookie3 = await createFormDataCookie({
              userId: user.id,
              index: 2,
            }).serialize(data.slice(10));
            const request = new Request("http://localhost/", {
              headers: {
                Cookie: [cookie, cookie3].join(";"),
              },
            });
            const retrievedData = await getStoredFormData({
              request,
              user,
            });
            expect(retrievedData).toEqual({});
          });
        });

        describe("a left-over cookie is present", () => {
          it("ignores left-over cookie and returns stored data", async () => {
            const data = encryptCookie({
              userId: user.id,
              data: { grundstueck: { typ: { typ: "einfamilienhaus" } } },
            });
            const cookie = await createFormDataCookie({
              userId: user.id,
              index: 0,
            }).serialize("2" + data.slice(0, 10));
            const cookie2 = await createFormDataCookie({
              userId: user.id,
              index: 1,
            }).serialize(data.slice(10));
            const cookie3 = await createFormDataCookie({
              userId: user.id,
              index: 2,
            }).serialize(
              "data which would lead to a syntax error if taken into account"
            );
            const request = new Request("http://localhost/", {
              headers: {
                Cookie: [cookie, cookie2, cookie3].join(";"),
              },
            });
            const retrievedData = await getStoredFormData({
              request,
              user,
            });
            expect(retrievedData).toEqual({
              grundstueck: { typ: { typ: "einfamilienhaus" } },
            });
          });
        });
      });
    });

    describe("user id inside cookie does not match given user id", () => {
      it("returns empty object", async () => {
        const data = JSON.stringify({
          userId: "99999999",
          data: { sensitiveData: true },
        });
        const cookie = await createFormDataCookie({
          userId: user.id,
          index: 0,
        }).serialize("1" + data);
        const request = new Request("http://localhost/", {
          headers: {
            Cookie: cookie,
          },
        });
        const retrievedData = await getStoredFormData({
          request,
          user,
        });
        expect(retrievedData).toEqual({});
      });
    });
  });
});

describe("createHeadersWithFormDataCookie", () => {
  const originalEnv = process.env;
  const data = { sensitiveData: "secret" } as GrundModel;

  beforeEach(async () => {
    jest.resetModules();
    process.env = {
      ...originalEnv,
      APP_ENV: "production",
    };
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  it("returns encrypted cookie string", async () => {
    const headers = await createHeadersWithFormDataCookie({ data, user });
    expect(headers?.get("Set-Cookie")).not.toContain("secret");
  });

  it("returns cookie string with flag SameSite=Strict", async () => {
    const headers = await createHeadersWithFormDataCookie({ data, user });
    expect(headers?.get("Set-Cookie")).toContain("SameSite=Strict");
  });

  it("returns cookie string with flag HttpOnly", async () => {
    const headers = await createHeadersWithFormDataCookie({ data, user });
    expect(headers?.get("Set-Cookie")).toContain("HttpOnly");
  });

  it("returns cookie string with flag Secure", async () => {
    const headers = await createHeadersWithFormDataCookie({ data, user });
    expect(headers?.get("Set-Cookie")).toContain("Secure");
  });

  describe("with large data", () => {
    const largeData = {
      sensitiveData:
        "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",
    } as GrundModel;

    it("returns cookie string with a second cookie", async () => {
      const headers = await createHeadersWithFormDataCookie({
        data: largeData,
        user,
      });
      expect(headers?.get("Set-Cookie")).toContain("form_data_1_");
    });
  });
});
