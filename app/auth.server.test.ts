import * as userModule from "~/domain/user";
import bcrypt from "bcryptjs";
import { authenticator } from "~/auth.server";

describe("authenticator.isAuthenticated", () => {
  const correctPassword = "12345678";
  const email = "found@foo.com";

  describe("with user not found", () => {
    beforeAll(async () => {
      await bcrypt.hash(correctPassword, 10);
      jest
        .spyOn(userModule, "findUserByEmail")
        .mockImplementation(
          jest.fn(() => Promise.resolve(undefined)) as jest.Mock
        );
    });

    it("throws error", async () => {
      const body = new FormData();
      body.set("email", "unknown@foo.com");
      body.set("password", correctPassword);
      const request = new Request("http://localhost/", {
        body,
        method: "POST",
      });

      await expect(
        authenticator.authenticate("user-pass", request, {
          successRedirect: "/",
          throwOnError: true,
        })
      ).rejects.toThrow();
    });
  });

  describe("with user found", () => {
    beforeAll(async () => {
      const password_hash = await bcrypt.hash(correctPassword, 10);
      jest.spyOn(userModule, "findUserByEmail").mockImplementation(
        jest.fn(() =>
          Promise.resolve({
            email: email,
            id: 1,
            identified: false,
            password: password_hash,
          })
        ) as jest.Mock
      );
    });

    it("throws error if incorrect password used", async () => {
      const body = new FormData();
      body.set("email", email);
      body.set("password", "incorrectPassword");
      const request = new Request("http://localhost/", {
        body,
        method: "POST",
      });

      await expect(
        authenticator.authenticate("user-pass", request, {
          successRedirect: "/",
          throwOnError: true,
        })
      ).rejects.toThrow();
    });

    it("returns redirect if correct password used", async () => {
      const body = new FormData();
      body.set("email", email);
      body.set("password", correctPassword);
      const request = new Request("http://localhost/", {
        body,
        method: "POST",
      });

      await authenticator
        .isAuthenticated(request, {
          successRedirect: "/redirectionUrl",
        })
        .catch((response) => {
          expect(response.status).toEqual(302);
          expect(response.headers.get("Location")).toEqual("/redirectionUrl");
        });
    });

    it("returns redirect if if correct password used and capitalized email", async () => {
      const body = new FormData();
      body.set("email", email.toUpperCase());
      body.set("password", correctPassword);
      const request = new Request("http://localhost/", {
        body,
        method: "POST",
      });

      await authenticator
        .isAuthenticated(request, {
          successRedirect: "/redirectionUrl",
        })
        .catch((response) => {
          expect(response.status).toEqual(302);
          expect(response.headers.get("Location")).toEqual("/redirectionUrl");
        });
    });
  });
});
