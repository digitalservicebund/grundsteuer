import {
  rememberCookie,
  rememberCookieExists,
} from "~/rememberLoggedInEmails.server";

const SAMPLE = {
  cookie: "login=MQ%3D%3D; Max-Age=10368000; Path=/; HttpOnly; SameSite=Lax",
};

describe("rememberCookie", () => {
  describe("when no emails where remembered before", () => {
    it("returns new cookie", async () => {
      const cookie = await rememberCookie();
      expect(cookie).toEqual(SAMPLE.cookie);
    });
  });
});

describe("rememberCookieExists", () => {
  describe("when no login was remembered before", () => {
    it("returns false", async () => {
      const exists = await rememberCookieExists({
        cookieHeader: null,
      });
      expect(exists).toBe(false);
    });
  });

  describe("when login was remembered before", () => {
    it("returns true", async () => {
      const exists = await rememberCookieExists({
        cookieHeader: SAMPLE.cookie,
      });
      expect(exists).toBe(true);
    });
  });
});
