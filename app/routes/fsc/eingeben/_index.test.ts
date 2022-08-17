import { loader, action } from "~/routes/fsc/eingeben/index";
import { getSession } from "~/session.server";
import * as freischaltCodeAktivierenModule from "~/erica/freischaltCodeAktivieren";
import * as freischaltCodeStornierenModule from "~/erica/freischaltCodeStornieren";
import * as userModule from "~/domain/user";
import * as auditLogModule from "~/audit/auditLog";
import { sessionUserFactory } from "test/factories";
import {
  getLoaderArgsWithAuthenticatedSession,
  mockIsAuthenticated,
} from "test/mocks/authenticationMocks";
import { getMockedFunction } from "test/mocks/mockHelper";
import { AuditLogEvent } from "~/audit/auditLog";
import * as csrfModule from "~/util/csrf";
import { mockActionArgs } from "testUtil/mockActionArgs";
import { DataFunctionArgs } from "@remix-run/node";

describe("Loader", () => {
  const expectedTransferticket = "foo12345";
  const expectedTaxIdNumber = "007";

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
      {
        transferticket: expectedTransferticket,
        taxIdNumber: expectedTaxIdNumber,
      }
    );
    getMockedFunction(freischaltCodeStornierenModule, "revokeFreischaltCode", {
      location: "007",
    });
  });

  afterAll(() => {
    jest.clearAllMocks();
  });

  describe("with unidentified user", () => {
    beforeEach(async () => {
      getMockedFunction(userModule, "findUserByEmail", {
        email: "existing_user@foo.com",
        ericaRequestIdFscAktivieren: "foo",
        fscRequest: { requestId: "foo" },
      });
    });

    it("should be inProgress if erica sends activation success", async () => {
      const response = await loader(
        await getLoaderArgsWithAuthenticatedSession(
          "/fsc/eingeben",
          "existing_user@foo.com"
        )
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

      await loader(
        await getLoaderArgsWithAuthenticatedSession(
          "/fsc/eingeben",
          "existing_user@foo.com"
        )
      );

      expect(spyOnSetUserIdentified).toHaveBeenCalledWith(
        "existing_user@foo.com"
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
        await getLoaderArgsWithAuthenticatedSession(
          "/fsc/eingeben",
          "existing_user@foo.com"
        )
      );

      const session = await getSession(response.headers.get("Set-Cookie"));

      expect(session.get("user").identified).toBe(true);
    });

    it("should save audit log if erica sends activation success", async () => {
      const timestamp = 1652887920227;
      const expectedClientIp = "123.007";
      const args = await getLoaderArgsWithAuthenticatedSession(
        "/fsc/eingeben",
        "existing_user@foo.com"
      );
      args.context = { clientIp: expectedClientIp };

      const spyOnSaveAuditLog = jest.spyOn(auditLogModule, "saveAuditLog");
      const actualNowImplementation = Date.now;

      try {
        Date.now = jest.fn(() => timestamp);

        await loader(args);

        expect(spyOnSaveAuditLog).toHaveBeenCalledWith({
          eventName: AuditLogEvent.FSC_ACTIVATED,
          timestamp: Date.now(),
          ipAddress: expectedClientIp,
          username: "existing_user@foo.com",
          eventData: {
            transferticket: expectedTransferticket,
          },
        });
      } finally {
        Date.now = actualNowImplementation;
      }
    });

    it("should not save audit log if erica activation sends unexpected error", async () => {
      getMockedFunction(
        freischaltCodeAktivierenModule,
        "checkFreischaltcodeActivation",
        {
          errorType: "GeneralEricaError",
          errorMessage: "We found some problem",
        }
      );
      const args = await getLoaderArgsWithAuthenticatedSession(
        "/fsc/eingeben",
        "existing_user@foo.com"
      );
      const spyOnSaveAuditLog = jest.spyOn(auditLogModule, "saveAuditLog");
      try {
        await loader(args);
      } catch {
        expect(spyOnSaveAuditLog).not.toHaveBeenCalled();
      }
    });

    it("should not save audit log if erica activation sends expected error", async () => {
      getMockedFunction(
        freischaltCodeAktivierenModule,
        "checkFreischaltcodeActivation",
        {
          errorType: "EricaUserInputError",
          errorMessage: "ELSTER_REQUEST_ID_UNKNOWN",
        }
      );
      const args = await getLoaderArgsWithAuthenticatedSession(
        "/fsc/eingeben",
        "existing_user@foo.com"
      );
      const spyOnSaveAuditLog = jest.spyOn(auditLogModule, "saveAuditLog");
      await loader(args);
      expect(spyOnSaveAuditLog).not.toHaveBeenCalled();
    });

    it("should delete erica request id if erica sends not found error for aktivieren", async () => {
      getMockedFunction(
        freischaltCodeAktivierenModule,
        "checkFreischaltcodeActivation",
        {
          errorType: "EricaRequestNotFound",
          errorMessage: "Could not find request",
        }
      );
      const args = await getLoaderArgsWithAuthenticatedSession(
        "/fsc/beantragen",
        "existing_user@foo.com"
      );
      const spyOnDeleteEricaRequestId = jest.spyOn(
        userModule,
        "deleteEricaRequestIdFscAktivieren"
      );
      await expect(async () => {
        await loader(args);
      }).rejects.toThrow();
      expect(spyOnDeleteEricaRequestId).toHaveBeenCalled();

      spyOnDeleteEricaRequestId.mockClear();
    });

    it("should throw if erica sends not found error for aktivieren", async () => {
      getMockedFunction(
        freischaltCodeAktivierenModule,
        "checkFreischaltcodeActivation",
        {
          errorType: "EricaRequestNotFound",
          errorMessage: "Could not find request",
        }
      );
      const args = await getLoaderArgsWithAuthenticatedSession(
        "/fsc/beantragen",
        "existing_user@foo.com"
      );
      await expect(async () => {
        await loader(args);
      }).rejects.toThrow();
    });
  });

  describe("with identified user", () => {
    beforeEach(async () => {
      getMockedFunction(userModule, "findUserByEmail", {
        email: "existing_user@foo.com",
        ericaRequestIdFscStornieren: "foo",
        fscRequest: { requestId: "foo" },
        identified: true,
      });
    });

    it("should delete fscRequestId if erica sends revocation success", async () => {
      getMockedFunction(
        freischaltCodeStornierenModule,
        "checkFreischaltcodeRevocation",
        {
          transferticket: expectedTransferticket,
          taxIdNumber: expectedTaxIdNumber,
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

      await loader(
        await getLoaderArgsWithAuthenticatedSession(
          "/fsc/eingeben",
          "existing_user@foo.com"
        )
      );

      expect(spyOnSetUserIdentified).not.toHaveBeenCalled();
      expect(spyOnDeleteEricaRequestIdFscStornieren).toHaveBeenCalledWith(
        "existing_user@foo.com"
      );
      expect(spyOnDeleteFscRequest).toHaveBeenCalledWith(
        "existing_user@foo.com",
        "foo"
      );
    });

    it("should save audit log if erica sends revocation success", async () => {
      getMockedFunction(
        freischaltCodeStornierenModule,
        "checkFreischaltcodeRevocation",
        {
          transferticket: expectedTransferticket,
          taxIdNumber: expectedTaxIdNumber,
        }
      );

      const timestamp = 1652887920227;
      const expectedClientIp = "123.007";
      const args = await getLoaderArgsWithAuthenticatedSession(
        "/fsc/eingeben",
        "existing_user@foo.com"
      );
      args.context = { clientIp: expectedClientIp };

      const spyOnSaveAuditLog = jest.spyOn(auditLogModule, "saveAuditLog");
      const actualNowImplementation = Date.now;

      try {
        Date.now = jest.fn(() => timestamp);

        await loader(args);

        expect(spyOnSaveAuditLog).toHaveBeenCalledWith({
          eventName: AuditLogEvent.FSC_REVOKED,
          timestamp: Date.now(),
          ipAddress: expectedClientIp,
          username: "existing_user@foo.com",
          eventData: {
            transferticket: expectedTransferticket,
          },
        });
      } finally {
        Date.now = actualNowImplementation;
      }
    });

    it("should not save audit log if erica revocation sends expected error", async () => {
      getMockedFunction(
        freischaltCodeStornierenModule,
        "checkFreischaltcodeRevocation",
        {
          errorType: "EricaUserInputError",
          errorMessage: "ELSTER_REQUEST_ID_UNKNOWN",
        }
      );
      const args = await getLoaderArgsWithAuthenticatedSession(
        "/fsc/eingeben",
        "existing_user@foo.com"
      );
      const spyOnSaveAuditLog = jest.spyOn(auditLogModule, "saveAuditLog");
      await loader(args);
      expect(spyOnSaveAuditLog).not.toHaveBeenCalled();
    });

    it("should not save audit log if erica revocation sends unexpected error", async () => {
      getMockedFunction(
        freischaltCodeStornierenModule,
        "checkFreischaltcodeRevocation",
        {
          errorType: "GeneralEricaError",
          errorMessage: "We found some problem",
        }
      );
      const args = await getLoaderArgsWithAuthenticatedSession(
        "/fsc/eingeben",
        "existing_user@foo.com"
      );
      const spyOnSaveAuditLog = jest.spyOn(auditLogModule, "saveAuditLog");
      await loader(args);
      expect(spyOnSaveAuditLog).not.toHaveBeenCalled();
    });

    it("should not delete fscRequestId if erica sends revocation failure", async () => {
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

      await loader(
        await getLoaderArgsWithAuthenticatedSession(
          "/fsc/eingeben",
          "existing_user@foo.com"
        )
      );

      expect(spyOnSetUserIdentified).not.toHaveBeenCalled();
      expect(spyOnDeleteEricaRequestIdFscStornieren).toHaveBeenCalledWith(
        "existing_user@foo.com"
      );
      expect(spyOnDeleteFscRequest).not.toHaveBeenCalled();

      spyOnDeleteFscRequest.mockClear();
    });

    it("should delete erica request id if erica sends not found error for stornieren", async () => {
      getMockedFunction(
        freischaltCodeStornierenModule,
        "checkFreischaltcodeRevocation",
        {
          errorType: "EricaRequestNotFound",
          errorMessage: "Could not find request",
        }
      );
      const args = await getLoaderArgsWithAuthenticatedSession(
        "/fsc/beantragen",
        "existing_user@foo.com"
      );
      const spyOnDeleteEricaRequestId = jest.spyOn(
        userModule,
        "deleteEricaRequestIdFscStornieren"
      );
      await loader(args);
      expect(spyOnDeleteEricaRequestId).toHaveBeenCalled();

      spyOnDeleteEricaRequestId.mockClear();
    });

    it("should return not spinning if erica sends not found error for stornieren", async () => {
      getMockedFunction(
        freischaltCodeStornierenModule,
        "checkFreischaltcodeRevocation",
        {
          errorType: "EricaRequestNotFound",
          errorMessage: "Could not find request",
        }
      );
      const args = await getLoaderArgsWithAuthenticatedSession(
        "/fsc/beantragen",
        "existing_user@foo.com"
      );
      const result = await loader(args);
      expect(result.showSpinner).toEqual(false);
    });
  });
});

describe("Action", () => {
  beforeAll(async () => {
    getMockedFunction(csrfModule, "verifyCsrfToken", Promise.resolve());
    mockIsAuthenticated.mockImplementation(() =>
      Promise.resolve(
        sessionUserFactory.build({
          email: "existing_user@foo.com",
        })
      )
    );
  });

  test("Returns no data if storno in progress", async () => {
    const userMock = getMockedFunction(userModule, "findUserByEmail", {
      email: "existing_user@foo.com",
      ericaRequestIdFscStornieren: "storno-id",
    });
    try {
      const args = await mockActionArgs({
        route: "/fsc/eingeben",
        formData: { freischaltCode: "XXXX-XXXX-XXXX" },
        context: {},
        email: "existing_user@foo.com",
        allData: {},
      });

      const result = await action(args);

      expect(result).toEqual({});
    } finally {
      userMock.mockRestore();
    }
  });

  test("Returns no data if eingeben in progress", async () => {
    const userMock = getMockedFunction(userModule, "findUserByEmail", {
      email: "existing_user@foo.com",
      ericaRequestIdFscAktivieren: "eingeben-id",
    });
    try {
      const args = await mockActionArgs({
        route: "/fsc/eingeben",
        formData: { freischaltCode: "XXXX-XXXX-XXXX" },
        context: {},
        email: "existing_user@foo.com",
        allData: {},
      });

      const result = await action(args);

      expect(result).toEqual({});
    } finally {
      userMock.mockRestore();
    }
  });

  describe("With correct user state", () => {
    let userMock: jest.SpyInstance;
    const fscRequestId = "fsc-request";
    beforeAll(() => {
      userMock = getMockedFunction(userModule, "findUserByEmail", {
        email: "existing_user@foo.com",
        fscRequest: { requestId: fscRequestId },
      });
    });

    afterAll(() => {
      userMock.mockRestore();
    });

    test("Returns errors if no data provided", async () => {
      const args = await mockActionArgs({
        route: "/fsc/beantragen",
        formData: { freischaltCode: "" },
        context: {},
        email: "existing_user@foo.com",
        allData: {},
      });

      const result = await action(args);

      expect(await result).toEqual({
        errors: {
          freischaltCode: "Bitte füllen Sie dieses Feld aus.",
        },
      });
    });

    describe("With correct form data", () => {
      let correctArgs: DataFunctionArgs;
      let eingebenMock: jest.SpyInstance;
      const formData = {
        freischaltCode: "XXXX-XXXX-XXXX",
      };

      beforeAll(async () => {
        correctArgs = await mockActionArgs({
          route: "/fsc/eingeben",
          formData: formData,
          context: {},
          email: "existing_user@foo.com",
          allData: {},
        });
      });

      describe("with success erica aktivieren response", () => {
        beforeAll(() => {
          eingebenMock = getMockedFunction(
            freischaltCodeAktivierenModule,
            "activateFreischaltCode",
            Promise.resolve({ location: "007" })
          );
        });

        afterEach(() => {
          eingebenMock.mockClear();
        });

        afterAll(() => {
          eingebenMock.mockRestore();
        });

        test("starts fsc aktivieren", async () => {
          await action(correctArgs);
          expect(eingebenMock).toHaveBeenCalledWith(
            formData.freischaltCode,
            fscRequestId
          );
        });

        test("returns no data", async () => {
          const result = await action(correctArgs);
          expect(await result).toEqual({});
        });
      });

      describe("with errornous erica aktivieren response", () => {
        beforeAll(() => {
          eingebenMock = getMockedFunction(
            freischaltCodeAktivierenModule,
            "activateFreischaltCode",
            Promise.resolve({ error: "EricaWrongFormat" })
          );
        });

        afterEach(() => {
          eingebenMock.mockClear();
        });

        afterAll(() => {
          eingebenMock.mockRestore();
        });

        test("returns erica error", async () => {
          const result = await action(correctArgs);
          expect(await result).toEqual({ ericaApiError: "EricaWrongFormat" });
        });
      });
    });
  });
});
