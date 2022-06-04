import * as userModule from "~/domain/user";
import { authenticator } from "~/auth.server";

describe("authenticator.isAuthenticated", () => {
  const email = "found@foo.com";

  describe("with user found", () => {
    beforeAll(async () => {
      jest.spyOn(userModule, "findUserByEmail").mockImplementation(
        jest.fn(() =>
          Promise.resolve({
            email: email,
            id: 1,
            identified: false,
          })
        ) as jest.Mock
      );
    });

    it("returns redirect", async () => {
      const body = new FormData();
      body.set("email", email);
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

    it("returns redirect if  capitalized email", async () => {
      const body = new FormData();
      body.set("email", email.toUpperCase());
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
