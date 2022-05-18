import {
  getLoaderArgsWithAuthenticatedSession,
  mockIsAuthenticated,
} from "test/mocks/authenticationMocks";
import { sessionUserFactory } from "test/factories";
import * as freischaltCodeBeantragenModule from "~/erica/freischaltCodeBeantragen";
import * as auditLogModule from "~/audit/auditLog";
import * as userModule from "~/domain/user";
import { getMockedFunction } from "test/mocks/mockHelper";
import { loader } from "~/routes/fsc/beantragen/index";
import { AuditLogEvent } from "~/audit/auditLog";
import bcrypt from "bcryptjs";

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
      password: await bcrypt.hash("12345678", 10),
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
  });
});
