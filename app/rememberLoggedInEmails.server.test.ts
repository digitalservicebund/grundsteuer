import {
  appendEmailToRememberCookie,
  emailIsInRememberCookie,
  rememberCookieExists,
} from "~/rememberLoggedInEmails.server";

const SAMPLE = {
  email: "ponda.baba@example.com",
  cookie:
    "remember_logged_in_emails=WyI2ZTdiMTNjZmViZTI3Mzk3ZDEyNmJlYTliMmJjOTgwMGQwZDg5ZTM5Il0%3D.Cz98nbt7m0yHuoF5wDHxdL2Y51RgntXyfzxxGNLUv%2BY; Max-Age=10368000; Path=/; HttpOnly; SameSite=Lax",
};

describe("appendEmailToRememberCookie", () => {
  describe("when no emails where remembered before", () => {
    it("returns new cookie", async () => {
      const cookie = await appendEmailToRememberCookie({
        email: SAMPLE.email,
        cookieHeader: null,
      });
      expect(cookie).toEqual(SAMPLE.cookie);
    });
  });

  describe("when same email was already remembered", () => {
    it("returns 'same' cookie", async () => {
      const cookie = await appendEmailToRememberCookie({
        email: SAMPLE.email,
        cookieHeader: SAMPLE.cookie,
      });
      expect(cookie).toEqual(SAMPLE.cookie);
    });
  });

  describe("when emails where already remembered, but not this one", () => {
    it("returns cookie with new email appended", async () => {
      const cookie = await appendEmailToRememberCookie({
        email: "rose.tico@example.com",
        cookieHeader: SAMPLE.cookie,
      });
      // new cookie contains 2 hashes
      expect(cookie).toEqual(
        "remember_logged_in_emails=WyI2ZTdiMTNjZmViZTI3Mzk3ZDEyNmJlYTliMmJjOTgwMGQwZDg5ZTM5IiwiMzM1M2U0NzkwNDUyMDU1N2Q5YjhkNjI3ZjJhZDQxMWVmODA1ZmRjOSJd.GMsPWXVsEGwj6pjdO2jJWShl9OG0SJ5L%2B837NHzmlIY; Max-Age=10368000; Path=/; HttpOnly; SameSite=Lax"
      );
    });
  });
});

describe("rememberLoggedInEmailsCookieExists", () => {
  describe("when no emails where remembered before", () => {
    it("returns false", async () => {
      const exists = await rememberCookieExists({
        cookieHeader: null,
      });
      expect(exists).toBe(false);
    });
  });

  describe("when emails where remembered before", () => {
    it("returns false", async () => {
      const exists = await rememberCookieExists({
        cookieHeader: SAMPLE.cookie,
      });
      expect(exists).toBe(true);
    });
  });
});

describe("emailIsInRememberCookie", () => {
  describe("when email is not remembered", () => {
    it("returns false", async () => {
      const isIncluded = await emailIsInRememberCookie({
        email: "jaro.tapal@example.com",
        cookieHeader: null,
      });
      expect(isIncluded).toBe(false);
    });
  });

  describe("when email is remembered", () => {
    it("returns true", async () => {
      const isIncluded = await emailIsInRememberCookie({
        email: SAMPLE.email,
        cookieHeader: SAMPLE.cookie,
      });
      expect(isIncluded).toBe(true);
    });
  });
});
