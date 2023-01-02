import * as userModule from "~/domain/user";
import { getMockedFunction } from "test/mocks/mockHelper";
import { loader } from "~/routes/bundesIdent/desktop";
import { getLoaderArgsWithAuthenticatedSession } from "test/mocks/authenticationMocks";

let userMock: jest.SpyInstance;

describe("Loader", () => {
  describe("User not identified", () => {
    beforeAll(() => {
      userMock = getMockedFunction(userModule, "findUserByEmail", {
        email: "existing_user@foo.com",
        userId: "1234",
      });
    });

    afterEach(() => {
      jest.clearAllMocks();
    });
    afterAll(() => {
      userMock.mockRestore();
    });

    it("returns no error if no reload", async () => {
      const result = await loader(
        await getLoaderArgsWithAuthenticatedSession(
          "/bundesIdent/desktop",
          "existing_user@foo.com"
        )
      );
      expect(result).toEqual({});
    });

    it("returns error if reload", async () => {
      const result = await loader(
        await getLoaderArgsWithAuthenticatedSession(
          "/bundesIdent/desktop?reload=true",
          "existing_user@foo.com"
        )
      );
      expect(result).toEqual({ showNotIdentifiedError: true });
    });
  });

  describe("User identified", () => {
    beforeAll(() => {
      userMock = getMockedFunction(userModule, "findUserByEmail", {
        email: "existing_user@foo.com",
        userId: "1234",
        identified: true,
      });
    });

    afterEach(() => {
      jest.clearAllMocks();
    });
    afterAll(() => {
      userMock.mockRestore();
    });

    it("returns success redirect if no reload", async () => {
      const result = await loader(
        await getLoaderArgsWithAuthenticatedSession(
          "/bundesIdent/desktop",
          "existing_user@foo.com"
        )
      );
      expect(result.status).toEqual(302);
      expect(result.headers.get("Location")).toEqual(
        "/identifikation/erfolgreich"
      );
    });

    it("returns success redirect if reload", async () => {
      const result = await loader(
        await getLoaderArgsWithAuthenticatedSession(
          "/bundesIdent/desktop?reload=true",
          "existing_user@foo.com"
        )
      );
      expect(result.status).toEqual(302);
      expect(result.headers.get("Location")).toEqual(
        "/identifikation/erfolgreich"
      );
    });
  });
});
