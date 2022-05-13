import { loader } from "~/routes/fsc/eingeben/index";
import { commitSession, getSession } from "~/session.server";
import bcrypt from "bcryptjs";
import * as freischaltCodeAktivierenModule from "~/erica/freischaltCodeAktivieren";
import * as freischaltCodeStornierenModule from "~/erica/freischaltCodeStornieren";
import * as userModule from "~/domain/user";
import { sessionUserFactory } from "test/factories";
import {
  getAuthenticatedSession,
  mockIsAuthenticated,
} from "test/mocks/authenticationMocks";
import { getMockedFunction } from "test/mocks/mockHelper";

const getLoaderArgsWithAuthenticatedSession = async () => ({
  request: new Request("/fsc/eingeben", {
    headers: {
      cookie: await commitSession(
        await getAuthenticatedSession("existing_user@foo.com")
      ),
    },
  }),
  params: {},
  context: {},
});

describe("Loader", () => {
  beforeAll(() => {
    mockIsAuthenticated.mockImplementation(() =>
      Promise.resolve(
        sessionUserFactory.build({
          email: "existing_user@foo.com",
          identified: true,
        })
      )
    );
  });

  beforeEach(() => {
    jest.clearAllMocks();
    getMockedFunction(
      freischaltCodeAktivierenModule,
      "checkFreischaltcodeActivation",
      true
    );
    getMockedFunction(
      freischaltCodeStornierenModule,
      "revokeFreischaltCode",
      "007"
    );
  });

  afterAll(() => {
    jest.clearAllMocks();
  });

  describe("with unidentified user", () => {
    beforeEach(async () => {
      getMockedFunction(userModule, "findUserByEmail", {
        email: "existing_user@foo.com",
        ericaRequestIdFscAktivieren: "foo",
        password: await bcrypt.hash("12345678", 10),
        fscRequest: [{ requestId: "foo" }],
      });
    });

    it("should be inProgress if erica sends activation success", async () => {
      const response = await loader(
        await getLoaderArgsWithAuthenticatedSession()
      );
      const jsonResponse = await response.json();

      expect(jsonResponse.showSpinner).toBe(true);
    });

    it("should set user fields correctly if erica sends activation success", async () => {
      const spyOnSetUserIdentified = jest.spyOn(
        userModule,
        "setUserIdentified"
      );
      const spyOnDeleteEricaRequestIdFscAktivieren = jest.spyOn(
        userModule,
        "deleteEricaRequestIdFscAktivieren"
      );
      const spyOnSaveEricaRequestIdFscStornieren = jest.spyOn(
        userModule,
        "saveEricaRequestIdFscStornieren"
      );

      const request = new Request("/fsc/eingeben", {
        headers: {
          cookie: await commitSession(
            await getAuthenticatedSession("existing_user@foo.com")
          ),
        },
      });
      await loader({
        request: request,
        params: {},
        context: {},
      });

      expect(spyOnSetUserIdentified).toHaveBeenCalledWith(
        "existing_user@foo.com",
        true
      );
      expect(spyOnDeleteEricaRequestIdFscAktivieren).toHaveBeenCalledWith(
        "existing_user@foo.com"
      );
      expect(spyOnSaveEricaRequestIdFscStornieren).toHaveBeenCalledWith(
        "existing_user@foo.com",
        "007"
      );
    });

    it("should set identified in session if erica sends activation success", async () => {
      const response = await loader(
        await getLoaderArgsWithAuthenticatedSession()
      );

      const session = await getSession(response.headers.get("Set-Cookie"));

      expect(session.get("user").identified).toBe(true);
    });
  });

  describe("with identified user", () => {
    beforeEach(async () => {
      getMockedFunction(userModule, "findUserByEmail", {
        email: "existing_user@foo.com",
        ericaRequestIdFscStornieren: "foo",
        password: await bcrypt.hash("12345678", 10),
        fscRequest: { requestId: "foo" },
        identified: true,
      });
    });

    it("should delete fscRequestId if identified and erica sends revocation success", async () => {
      getMockedFunction(
        freischaltCodeStornierenModule,
        "checkFreischaltcodeRevocation",
        true
      );
      const spyOnSetUserIdentified = jest.spyOn(
        userModule,
        "setUserIdentified"
      );
      const spyOnDeleteEricaRequestIdFscStornieren = jest.spyOn(
        userModule,
        "deleteEricaRequestIdFscStornieren"
      );
      const spyOnDeleteFscRequest = jest.spyOn(userModule, "deleteFscRequest");

      expect(spyOnSetUserIdentified).not.toHaveBeenCalled();

      await loader(await getLoaderArgsWithAuthenticatedSession());

      expect(spyOnSetUserIdentified).not.toHaveBeenCalled();
      expect(spyOnDeleteEricaRequestIdFscStornieren).toHaveBeenCalledWith(
        "existing_user@foo.com"
      );
      expect(spyOnDeleteFscRequest).toHaveBeenCalledWith(
        "existing_user@foo.com",
        "foo"
      );
    });

    it("should not delete fscRequestId if identified and erica sends revocation failure", async () => {
      getMockedFunction(
        freischaltCodeStornierenModule,
        "checkFreischaltcodeRevocation",
        {
          errorType: "GeneralEricaError",
          errorMessage: "We found some problem",
        }
      );
      const spyOnSetUserIdentified = jest.spyOn(
        userModule,
        "setUserIdentified"
      );
      const spyOnDeleteEricaRequestIdFscStornieren = jest.spyOn(
        userModule,
        "deleteEricaRequestIdFscStornieren"
      );
      const spyOnDeleteFscRequest = jest.spyOn(userModule, "deleteFscRequest");

      await loader(await getLoaderArgsWithAuthenticatedSession());

      expect(spyOnSetUserIdentified).not.toHaveBeenCalled();
      expect(spyOnDeleteEricaRequestIdFscStornieren).toHaveBeenCalledWith(
        "existing_user@foo.com"
      );
      expect(spyOnDeleteFscRequest).not.toHaveBeenCalled();
    });
  });
});
