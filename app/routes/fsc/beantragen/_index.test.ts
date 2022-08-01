import {
  getLoaderArgsWithAuthenticatedSession,
  mockIsAuthenticated,
} from "test/mocks/authenticationMocks";
import { sessionUserFactory } from "test/factories";
import * as freischaltCodeBeantragenModule from "~/erica/freischaltCodeBeantragen";
import * as auditLogModule from "~/audit/auditLog";
import * as userModule from "~/domain/user";
import { getMockedFunction } from "test/mocks/mockHelper";
import { loader, action } from "~/routes/fsc/beantragen/index";
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

  beforeEach(async () => {
    jest.clearAllMocks();
    getMockedFunction(userModule, "findUserByEmail", {
      email: "existing_user@foo.com",
      ericaRequestIdFscBeantragen: "foo",
      fscRequest: null,
    });
  });

  afterAll(() => {
    jest.clearAllMocks();
  });

  it("should save audit log if erica sends request success", async () => {
    getMockedFunction(freischaltCodeBeantragenModule, "retrieveAntragsId", {
      elsterRequestId: "foo",
      transferticket: expectedTransferticket,
      taxIdNumber: expectedTaxIdNumber,
    });
    const timestamp = 1652887920227;
    const expectedClientIp = "123.007";
    const args = await getLoaderArgsWithAuthenticatedSession(
      "/fsc/beantragen",
      "existing_user@foo.com"
    );
    args.context = { clientIp: expectedClientIp };

    const spyOnSaveAuditLog = jest.spyOn(auditLogModule, "saveAuditLog");
    const actualNowImplementation = Date.now;

    try {
      Date.now = jest.fn(() => timestamp);

      await loader(args);

      expect(spyOnSaveAuditLog).toHaveBeenCalledWith({
        eventName: AuditLogEvent.FSC_REQUESTED,
        timestamp: Date.now(),
        ipAddress: expectedClientIp,
        username: "existing_user@foo.com",
        eventData: {
          steuerId: expectedTaxIdNumber,
          transferticket: expectedTransferticket,
        },
      });
    } finally {
      Date.now = actualNowImplementation;
    }
  });

  it("should not save audit log if erica fsc request sends unexpected error", async () => {
    getMockedFunction(freischaltCodeBeantragenModule, "retrieveAntragsId", {
      errorType: "GeneralEricaError",
      errorMessage: "We found some problem",
    });
    const args = await getLoaderArgsWithAuthenticatedSession(
      "/fsc/beantragen",
      "existing_user@foo.com"
    );
    const spyOnSaveAuditLog = jest.spyOn(auditLogModule, "saveAuditLog");
    try {
      await loader(args);
    } catch {
      expect(spyOnSaveAuditLog).not.toHaveBeenCalled();
    }
  });

  it("should not save audit log if erica fsc request sends expected error", async () => {
    getMockedFunction(freischaltCodeBeantragenModule, "retrieveAntragsId", {
      errorType: "EricaUserInputError",
      errorMessage: "ERIC_GLOBAL_PRUEF_FEHLER",
    });
    const args = await getLoaderArgsWithAuthenticatedSession(
      "/fsc/beantragen",
      "existing_user@foo.com"
    );
    const spyOnSaveAuditLog = jest.spyOn(auditLogModule, "saveAuditLog");
    await loader(args);
    expect(spyOnSaveAuditLog).not.toHaveBeenCalled();
    spyOnSaveAuditLog.mockClear();
  });

  it("should delete erica request id if erica sends not found error", async () => {
    getMockedFunction(freischaltCodeBeantragenModule, "retrieveAntragsId", {
      errorType: "EricaRequestNotFound",
      errorMessage: "Could not find request",
    });
    const args = await getLoaderArgsWithAuthenticatedSession(
      "/fsc/beantragen",
      "existing_user@foo.com"
    );
    const spyOnDeleteEricaRequestId = jest.spyOn(
      userModule,
      "deleteEricaRequestIdFscBeantragen"
    );
    await expect(async () => {
      await loader(args);
    }).rejects.toThrow();
    expect(spyOnDeleteEricaRequestId).toHaveBeenCalled();

    spyOnDeleteEricaRequestId.mockClear();
  });

  it("should throw error if erica sends not found error", async () => {
    getMockedFunction(freischaltCodeBeantragenModule, "retrieveAntragsId", {
      errorType: "EricaRequestNotFound",
      errorMessage: "Could not find request",
    });
    const args = await getLoaderArgsWithAuthenticatedSession(
      "/fsc/beantragen",
      "existing_user@foo.com"
    );
    await expect(async () => {
      await loader(args);
    }).rejects.toThrow();
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

  test("Returns no data if beantragen in progress", async () => {
    const stornoMock = getMockedFunction(userModule, "findUserByEmail", {
      email: "existing_user@foo.com",
      ericaRequestIdFscBeantragen: "storno-id",
    });
    try {
      const args = await mockActionArgs({
        route: "/fsc/beantragen",
        formData: { steuerId: "03 352 417 692", geburtsdatum: "01.01.1985" },
        context: {},
        userEmail: "existing_user@foo.com",
        allData: {},
      });

      const result = await action(args);

      expect(result).toEqual({});
    } finally {
      stornoMock.mockRestore();
    }
  });

  describe("With correct user state", () => {
    let userMock: jest.SpyInstance;
    beforeAll(() => {
      userMock = getMockedFunction(userModule, "findUserByEmail", {
        email: "existing_user@foo.com",
      });
    });

    afterAll(() => {
      userMock.mockRestore();
    });

    test("Returns errors if no data provided", async () => {
      const args = await mockActionArgs({
        route: "/fsc/beantragen",
        formData: { steuerId: "", geburtsdatum: "" },
        context: {},
        userEmail: "existing_user@foo.com",
        allData: {},
      });

      const result = await action(args);

      expect(result).toEqual({
        errors: {
          steuerId: "Bitte füllen Sie dieses Feld aus.",
          geburtsdatum: "Bitte füllen Sie dieses Feld aus.",
        },
      });
    });

    describe("With correct form data", () => {
      let correctArgs: DataFunctionArgs;
      let beantragenMock: jest.SpyInstance;
      const formData = {
        steuerId: "03 352 417 692",
        geburtsdatum: "01.01.1985",
      };
      const normalizedFormData = {
        steuerId: "03352417692",
        geburtsdatum: "01.01.1985",
      };

      beforeAll(async () => {
        correctArgs = await mockActionArgs({
          route: "/fsc/beantragen",
          formData: formData,
          context: {},
          userEmail: "existing_user@foo.com",
          allData: {},
        });
      });

      describe("with success erica response", () => {
        beforeAll(() => {
          beantragenMock = getMockedFunction(
            freischaltCodeBeantragenModule,
            "requestNewFreischaltCode",
            Promise.resolve({ location: "007" })
          );
        });

        afterEach(() => {
          beantragenMock.mockClear();
        });

        afterAll(() => {
          beantragenMock.mockRestore();
        });

        test("starts fsc beantragen", async () => {
          await action(correctArgs);
          expect(beantragenMock).toHaveBeenCalledWith(
            normalizedFormData.steuerId,
            normalizedFormData.geburtsdatum
          );
        });

        test("returns no data", async () => {
          const result = await action(correctArgs);
          expect(await result).toEqual({});
        });
      });

      describe("with errornous erica response", () => {
        beforeAll(() => {
          beantragenMock = getMockedFunction(
            freischaltCodeBeantragenModule,
            "requestNewFreischaltCode",
            Promise.resolve({ error: "EricaWrongFormat" })
          );
        });

        afterEach(() => {
          beantragenMock.mockClear();
        });

        afterAll(() => {
          beantragenMock.mockRestore();
        });

        test("returns erica error", async () => {
          const result = await action(correctArgs);
          expect(await result).toEqual({ ericaApiError: "EricaWrongFormat" });
        });
      });
    });
  });
});
