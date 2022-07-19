import { sessionUserFactory } from "test/factories";
import {
  getLoaderArgsWithAuthenticatedSession,
  mockIsAuthenticated,
} from "test/mocks/authenticationMocks";
import { loader } from "~/routes/fsc";
import { getMockedFunction } from "test/mocks/mockHelper";
import * as userModule from "~/domain/user";

describe("Loader", () => {
  describe("with unidentified user", () => {
    beforeAll(() => {
      mockIsAuthenticated.mockImplementation(() =>
        Promise.resolve(
          sessionUserFactory.build({
            email: "existing_user@foo.com",
            identified: false,
            inDeclarationProcess: true,
          })
        )
      );
      getMockedFunction(userModule, "findUserByEmail", {
        email: "existing_user@foo.com",
        identified: false,
        inDeclarationProcess: true,
      });
    });

    afterAll(() => {
      jest.clearAllMocks();
    });

    // TODO re-enable once ekona is done
    it.skip("returns empty object", async () => {
      const result = await loader(
        await getLoaderArgsWithAuthenticatedSession(
          "/fsc",
          "existing_user@foo.com"
        )
      );
      expect(result).toEqual({});
    });
  });

  describe("with identified user", () => {
    beforeAll(() => {
      mockIsAuthenticated.mockImplementation(() =>
        Promise.resolve(
          sessionUserFactory.build({
            email: "existing_user@foo.com",
            identified: true,
            inDeclarationProcess: true,
          })
        )
      );
      getMockedFunction(userModule, "findUserByEmail", {
        email: "existing_user@foo.com",
        identified: true,
        inDeclarationProcess: true,
      });
    });

    afterAll(() => {
      jest.clearAllMocks();
    });

    it("returns redirect to formular start", async () => {
      const result = await loader(
        await getLoaderArgsWithAuthenticatedSession(
          "/fsc",
          "existing_user@foo.com"
        )
      );
      expect(result.status).toEqual(302);
      expect(result.headers.get("Location")).toEqual("/formular/welcome");
    });

    // TODO re-enable once ekona is done
    it.skip("returns empty object for fsc/eingeben/erfolgreich", async () => {
      const result = await loader(
        await getLoaderArgsWithAuthenticatedSession(
          "/fsc/eingeben/erfolgreich",
          "existing_user@foo.com"
        )
      );
      expect(result).toEqual({});
    });
  });
});
