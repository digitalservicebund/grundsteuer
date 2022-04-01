import {
  getStoredFormData,
  commitFormDataToStorage,
  createFormDataCookie,
} from "~/formDataStorage.server";
import { SessionUser } from "./auth.server";
import { GrundModel } from "./domain/steps";

const user = { id: "12345678-12345678" } as SessionUser;

process.env.FORM_COOKIE_SECRET = "secret";

describe("getStoredFormData", () => {
  describe("no cookie present", () => {
    it("returns empty object", async () => {
      const request = new Request("/");
      const data = await getStoredFormData({
        request,
        user,
      });
      expect(data).toEqual({});
    });
  });

  describe("cookie for given user is present", () => {
    it("returns stored data", async () => {
      const data = { sensitiveData: true } as GrundModel;
      const request = new Request("/", {
        headers: {
          Cookie: await commitFormDataToStorage({
            data,
            user,
          }),
        },
      });
      const retrievedData = await getStoredFormData({
        request,
        user,
      });
      expect(retrievedData).toEqual(data);
    });
  });

  describe("attacker copies victim's cookie content into their own cookie", () => {
    const dataForDivergentUserIds = async (
      cookieNameUserId: string,
      cookieContentUserId: string
    ) => {
      const cookie = createFormDataCookie(cookieNameUserId);
      const cookieContent = {
        userId: cookieContentUserId,
        data: {
          sensitiveData: true,
        },
      };
      const serializedCookie = await cookie.serialize(cookieContent);
      const request = new Request("/", {
        headers: {
          Cookie: serializedCookie,
        },
      });
      const data = await getStoredFormData({
        request,
        user: { id: cookieNameUserId } as SessionUser,
      });
      return data;
    };

    it("returns empty object when user ids don't match", async () => {
      const data = await dataForDivergentUserIds(
        "12345678-12345678",
        "99999999-88888888"
      );
      expect(data).toEqual({});
    });

    it("returns data when user ids match (control test)", async () => {
      const data = await dataForDivergentUserIds(
        "12345678-12345678",
        "12345678-12345678"
      );
      expect(data).toEqual({ sensitiveData: true });
    });
  });
});

describe("commitFormDataToStorage", () => {
  const originalEnv = process.env;
  const data = { sensitiveData: "secret" } as GrundModel;
  let serializedCookie: string;

  beforeEach(async () => {
    jest.resetModules();
    process.env = {
      ...originalEnv,
      APP_ENV: "production",
    };
    serializedCookie = await commitFormDataToStorage({ data, user });
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  it("returns encrypted cookie string", () => {
    expect(serializedCookie).not.toContain("secret");
  });

  it("returns cookie string with flag SameSite=Strict", () => {
    expect(serializedCookie).toContain("SameSite=Strict");
  });

  it("returns cookie string with flag HttpOnly", () => {
    expect(serializedCookie).toContain("HttpOnly");
  });
  it("returns cookie string with flag Secure", () => {
    expect(serializedCookie).toContain("Secure");
  });
});
