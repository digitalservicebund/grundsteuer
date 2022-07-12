import { loader } from "~/routes/fsc/neuBeantragen/index";
import { getSession } from "~/session.server";
import * as freischaltCodeStornierenModule from "~/erica/freischaltCodeStornieren";
import * as freischaltCodeBeantragenModule from "~/erica/freischaltCodeBeantragen";
import * as userModule from "~/domain/user";
import * as auditLogModule from "~/audit/auditLog";
import { AuditLogEvent } from "~/audit/auditLog";
import { getLoaderArgsWithAuthenticatedSession } from "test/mocks/authenticationMocks";
import { getMockedFunction } from "test/mocks/mockHelper";
import SpyInstance = jest.SpyInstance;

describe("Loader", () => {
  beforeAll(async () => {
    getMockedFunction(userModule, "findUserByEmail", {
      email: "existing_user@foo.com",
      fscRequest: { requestId: "foo" },
    });
  });

  afterAll(async () => {
    jest.resetAllMocks();
  });

  describe("with user with open fsc request", () => {
    it("Only renders if neuBeantragen isn't in progress", async () => {
      const args = await getLoaderArgsWithAuthenticatedSession(
        "/fsc/neuBeantragen",
        "existing_user@foo.com"
      );
      const response = await loader(args);
      const jsonResponse = await response.json();

      expect(jsonResponse.csrfToken).not.toBeUndefined();
      expect(jsonResponse.showSpinner).toBe(false);
      expect(jsonResponse.showError).toBe(false);

      expect(
        (await getSession(response.headers.get("Set-Cookie"))).get("user")
      ).toEqual(
        (await getSession(args.request.headers.get("Cookie"))).get("user")
      );
    });

    describe("with revocation in process", () => {
      const fscDataForSession = {
        fscData: { steuerId: "03352417692", geburtsdatum: "01.01.1985" },
      };

      beforeAll(async () => {
        getMockedFunction(userModule, "findUserByEmail", {
          email: "existing_user@foo.com",
          fscRequest: { requestId: "foo" },
          ericaRequestIdFscStornieren: "storno-id",
        });
      });

      describe("with revocation still running", () => {
        beforeAll(async () => {
          getMockedFunction(
            freischaltCodeStornierenModule,
            "checkFreischaltcodeRevocation",
            undefined
          );
        });

        it("returns correct data", async () => {
          const args = await getLoaderArgsWithAuthenticatedSession(
            "/fsc/neuBeantragen",
            "existing_user@foo.com",
            undefined,
            fscDataForSession
          );

          const response = await loader(args);
          const jsonResponse = await response.json();
          expect(jsonResponse.csrfToken).not.toBeUndefined();
          expect(jsonResponse.showSpinner).toBe(true);
          expect(jsonResponse.showError).toBe(false);

          expect(
            (await getSession(response.headers.get("Set-Cookie"))).get(
              "fscData"
            )
          ).toEqual(fscDataForSession["fscData"]);
        });

        it("does not save audit log", async () => {
          const args = await getLoaderArgsWithAuthenticatedSession(
            "/fsc/neuBeantragen",
            "existing_user@foo.com",
            undefined,
            fscDataForSession
          );
          const spyOnSaveAuditLog = jest.spyOn(auditLogModule, "saveAuditLog");

          await loader(args);

          expect(spyOnSaveAuditLog).not.toHaveBeenCalled();
        });
      });

      describe("with revocation errored with general error", () => {
        let beantragenMock: SpyInstance;
        beforeAll(async () => {
          getMockedFunction(
            freischaltCodeStornierenModule,
            "checkFreischaltcodeRevocation",
            {
              errorType: "GeneralEricaError",
              errorMessage: "We found some problem",
            }
          );
          beantragenMock = getMockedFunction(
            freischaltCodeBeantragenModule,
            "requestNewFreischaltCode",
            "request-id"
          );
        });

        it("returns correct data", async () => {
          const args = await getLoaderArgsWithAuthenticatedSession(
            "/fsc/neuBeantragen",
            "existing_user@foo.com",
            undefined,
            fscDataForSession
          );

          const response = await loader(args);

          const jsonResponse = await response.json();
          expect(jsonResponse.csrfToken).not.toBeUndefined();
          expect(jsonResponse.showSpinner).toBe(true);
          expect(jsonResponse.showError).toBe(false);

          expect(
            (await getSession(response.headers.get("Set-Cookie"))).get(
              "fscData"
            )
          ).toEqual(fscDataForSession["fscData"]);
        });

        it("does not save audit log", async () => {
          const args = await getLoaderArgsWithAuthenticatedSession(
            "/fsc/neuBeantragen",
            "existing_user@foo.com",
            undefined,
            fscDataForSession
          );
          const spyOnSaveAuditLog = jest.spyOn(auditLogModule, "saveAuditLog");

          await loader(args);

          expect(spyOnSaveAuditLog).not.toHaveBeenCalled();
        });

        it("starts beantragen process", async () => {
          const args = await getLoaderArgsWithAuthenticatedSession(
            "/fsc/neuBeantragen",
            "existing_user@foo.com",
            undefined,
            fscDataForSession
          );
          const deleteStornierenMock = getMockedFunction(
            userModule,
            "deleteEricaRequestIdFscStornieren",
            Promise.resolve()
          );
          const setBeantragenMock = getMockedFunction(
            userModule,
            "saveEricaRequestIdFscBeantragen",
            Promise.resolve()
          );

          try {
            await loader(args);

            expect(deleteStornierenMock).toHaveBeenCalledWith(
              "existing_user@foo.com"
            );
            expect(setBeantragenMock).toHaveBeenCalledWith(
              "existing_user@foo.com",
              "request-id"
            );
          } finally {
            deleteStornierenMock.mockClear();
            setBeantragenMock.mockClear();
          }
        });

        it("calls erica beantragen method", async () => {
          const args = await getLoaderArgsWithAuthenticatedSession(
            "/fsc/neuBeantragen",
            "existing_user@foo.com",
            undefined,
            fscDataForSession
          );

          await loader(args);

          expect(beantragenMock).toHaveBeenCalledWith(
            fscDataForSession.fscData.steuerId,
            fscDataForSession.fscData.geburtsdatum
          );
        });
      });

      describe("with revocation succeeded", () => {
        let beantragenMock: SpyInstance;
        const revocationTransferticket = "RevokeTransferticket";
        beforeAll(async () => {
          getMockedFunction(
            freischaltCodeStornierenModule,
            "checkFreischaltcodeRevocation",
            {
              transferticket: revocationTransferticket,
            }
          );
          beantragenMock = getMockedFunction(
            freischaltCodeBeantragenModule,
            "requestNewFreischaltCode",
            "request-id"
          );
        });

        it("returns correct data", async () => {
          const args = await getLoaderArgsWithAuthenticatedSession(
            "/fsc/neuBeantragen",
            "existing_user@foo.com",
            undefined,
            fscDataForSession
          );

          const response = await loader(args);

          const jsonResponse = await response.json();
          expect(jsonResponse.csrfToken).not.toBeUndefined();
          expect(jsonResponse.showSpinner).toBe(true);
          expect(jsonResponse.showError).toBe(false);

          expect(
            (await getSession(response.headers.get("Set-Cookie"))).get(
              "fscData"
            )
          ).toEqual(fscDataForSession["fscData"]);
        });

        it("saves audit log", async () => {
          const timestamp = 1652887920227;
          const expectedClientIp = "123.007";
          const args = await getLoaderArgsWithAuthenticatedSession(
            "/fsc/neuBeantragen",
            "existing_user@foo.com",
            undefined,
            fscDataForSession
          );
          args.context = { clientIp: expectedClientIp };
          const spyOnSaveAuditLog = jest.spyOn(auditLogModule, "saveAuditLog");
          spyOnSaveAuditLog.mockReset();
          const actualNowImplementation = Date.now;

          try {
            Date.now = jest.fn(() => timestamp);
            await loader(args);

            expect(spyOnSaveAuditLog).toHaveBeenCalledTimes(1);
            expect(spyOnSaveAuditLog).toHaveBeenCalledWith({
              eventName: AuditLogEvent.FSC_REVOKED,
              timestamp: Date.now(),
              ipAddress: expectedClientIp,
              username: "existing_user@foo.com",
              eventData: {
                transferticket: revocationTransferticket,
              },
            });
          } finally {
            Date.now = actualNowImplementation;
          }
        });

        it("starts beantragen process", async () => {
          const args = await getLoaderArgsWithAuthenticatedSession(
            "/fsc/neuBeantragen",
            "existing_user@foo.com",
            undefined,
            fscDataForSession
          );
          const deleteStornierenMock = getMockedFunction(
            userModule,
            "deleteEricaRequestIdFscStornieren",
            Promise.resolve()
          );
          const setBeantragenMock = getMockedFunction(
            userModule,
            "saveEricaRequestIdFscBeantragen",
            Promise.resolve()
          );

          try {
            await loader(args);

            expect(deleteStornierenMock).toHaveBeenCalledWith(
              "existing_user@foo.com"
            );
            expect(setBeantragenMock).toHaveBeenCalledWith(
              "existing_user@foo.com",
              "request-id"
            );
          } finally {
            deleteStornierenMock.mockClear();
            setBeantragenMock.mockClear();
          }
        });

        it("calls erica beantragen method", async () => {
          const args = await getLoaderArgsWithAuthenticatedSession(
            "/fsc/neuBeantragen",
            "existing_user@foo.com",
            undefined,
            fscDataForSession
          );

          await loader(args);

          expect(beantragenMock).toHaveBeenCalledWith(
            fscDataForSession.fscData.steuerId,
            fscDataForSession.fscData.geburtsdatum
          );
        });
      });
    });

    describe("with fsc request in process", () => {
      const fscDataForSession = {
        fscData: { steuerId: "03352417692", geburtsdatum: "01.01.1985" },
      };

      beforeAll(async () => {
        getMockedFunction(userModule, "findUserByEmail", {
          email: "existing_user@foo.com",
          fscRequest: { requestId: "foo" },
          ericaRequestIdFscBeantragen: "beantragen-id",
        });
      });

      describe("with fsc request still running", () => {
        beforeAll(async () => {
          getMockedFunction(
            freischaltCodeBeantragenModule,
            "retrieveAntragsId",
            undefined
          );
        });

        it("returns correct data", async () => {
          const args = await getLoaderArgsWithAuthenticatedSession(
            "/fsc/neuBeantragen",
            "existing_user@foo.com",
            undefined,
            fscDataForSession
          );

          const response = await loader(args);

          const jsonResponse = await response.json();
          expect(jsonResponse.csrfToken).not.toBeUndefined();
          expect(jsonResponse.showSpinner).toBe(true);
          expect(jsonResponse.showError).toBe(false);

          expect(
            (await getSession(response.headers.get("Set-Cookie"))).get(
              "fscData"
            )
          ).toEqual(fscDataForSession["fscData"]);
        });

        it("does not save audit log", async () => {
          const args = await getLoaderArgsWithAuthenticatedSession(
            "/fsc/neuBeantragen",
            "existing_user@foo.com",
            undefined,
            fscDataForSession
          );
          const spyOnSaveAuditLog = jest.spyOn(auditLogModule, "saveAuditLog");
          spyOnSaveAuditLog.mockReset();

          await loader(args);

          expect(spyOnSaveAuditLog).not.toHaveBeenCalled();
        });
      });

      describe("with fsc request errored with general error", () => {
        beforeAll(async () => {
          getMockedFunction(
            freischaltCodeBeantragenModule,
            "retrieveAntragsId",
            {
              errorType: "GeneralEricaError",
              errorMessage: "We found some problem",
            }
          );
        });

        it("throws error", async () => {
          const args = await getLoaderArgsWithAuthenticatedSession(
            "/fsc/neuBeantragen",
            "existing_user@foo.com",
            undefined,
            fscDataForSession
          );

          await expect(loader(args)).rejects.toThrow();
        });

        it("does not save audit log", async () => {
          const args = await getLoaderArgsWithAuthenticatedSession(
            "/fsc/neuBeantragen",
            "existing_user@foo.com",
            undefined,
            fscDataForSession
          );
          const spyOnSaveAuditLog = jest.spyOn(auditLogModule, "saveAuditLog");

          try {
            await loader(args);
          } catch (Error) {
            expect(spyOnSaveAuditLog).not.toHaveBeenCalled();
          }
        });
      });

      describe("with fsc request errored with user error", () => {
        beforeAll(async () => {
          getMockedFunction(
            freischaltCodeBeantragenModule,
            "retrieveAntragsId",
            {
              errorType: "EricaUserInputError",
              errorMessage: "We found some problem",
            }
          );
        });

        it("returns correct data", async () => {
          const args = await getLoaderArgsWithAuthenticatedSession(
            "/fsc/neuBeantragen",
            "existing_user@foo.com",
            undefined,
            fscDataForSession
          );

          const response = await loader(args);

          const jsonResponse = await response.json();
          expect(jsonResponse.csrfToken).not.toBeUndefined();
          expect(jsonResponse.showSpinner).toBe(false);
          expect(jsonResponse.showError).toBe(true);

          expect(
            (await getSession(response.headers.get("Set-Cookie"))).get(
              "fscData"
            )
          ).toBeUndefined();
        });

        it("does not save audit log", async () => {
          const args = await getLoaderArgsWithAuthenticatedSession(
            "/fsc/neuBeantragen",
            "existing_user@foo.com",
            undefined,
            fscDataForSession
          );
          const spyOnSaveAuditLog = jest.spyOn(auditLogModule, "saveAuditLog");

          await loader(args);

          expect(spyOnSaveAuditLog).not.toHaveBeenCalled();
        });
      });

      describe("with fsc request succeeded", () => {
        const fscRequestTransferticket = "FscRequestTransferticket";
        const antragsId = "bar";

        beforeAll(async () => {
          getMockedFunction(
            freischaltCodeBeantragenModule,
            "retrieveAntragsId",
            {
              transferticket: fscRequestTransferticket,
              elsterRequestId: antragsId,
              taxIdNumber: "123",
            }
          );
        });

        it("returns correct data", async () => {
          const args = await getLoaderArgsWithAuthenticatedSession(
            "/fsc/neuBeantragen",
            "existing_user@foo.com",
            undefined,
            fscDataForSession
          );

          const response = await loader(args);

          const jsonResponse = await response.json();
          expect(jsonResponse.csrfToken).not.toBeUndefined();
          expect(jsonResponse.showSpinner).toBe(true);
          expect(jsonResponse.showError).toBe(false);

          expect(
            (await getSession(response.headers.get("Set-Cookie"))).get(
              "fscData"
            )
          ).toEqual(fscDataForSession["fscData"]);
        });

        it("saves audit log", async () => {
          const timestamp = 1652887920227;
          const expectedClientIp = "123.007";
          const args = await getLoaderArgsWithAuthenticatedSession(
            "/fsc/neuBeantragen",
            "existing_user@foo.com",
            undefined,
            fscDataForSession
          );
          args.context = { clientIp: expectedClientIp };
          const spyOnSaveAuditLog = jest.spyOn(auditLogModule, "saveAuditLog");
          spyOnSaveAuditLog.mockReset();
          const actualNowImplementation = Date.now;

          try {
            Date.now = jest.fn(() => timestamp);
            await loader(args);

            expect(spyOnSaveAuditLog).toHaveBeenCalledTimes(1);
            expect(spyOnSaveAuditLog).toHaveBeenCalledWith({
              eventName: AuditLogEvent.FSC_REQUESTED,
              timestamp: Date.now(),
              ipAddress: expectedClientIp,
              username: "existing_user@foo.com",
              eventData: {
                steuerId: "123",
                transferticket: fscRequestTransferticket,
              },
            });
          } finally {
            Date.now = actualNowImplementation;
          }
        });

        it("stores new elsterRequestId and deletes ericaRequestId", async () => {
          const args = await getLoaderArgsWithAuthenticatedSession(
            "/fsc/neuBeantragen",
            "existing_user@foo.com",
            undefined,
            fscDataForSession
          );
          const deleteBeantragenMock = getMockedFunction(
            userModule,
            "deleteEricaRequestIdFscBeantragen",
            Promise.resolve()
          );
          const setFscRequestIdMock = getMockedFunction(
            userModule,
            "saveFscRequest",
            Promise.resolve()
          );

          try {
            await loader(args);

            expect(deleteBeantragenMock).toHaveBeenCalledWith(
              "existing_user@foo.com"
            );
            expect(setFscRequestIdMock).toHaveBeenCalledWith(
              "existing_user@foo.com",
              antragsId
            );
          } finally {
            deleteBeantragenMock.mockClear();
            setFscRequestIdMock.mockClear();
          }
        });
      });
    });

    describe("with neuBeantragen process finished", () => {
      const fscDataForSession = {
        fscData: { steuerId: "03352417692", geburtsdatum: "01.01.1985" },
      };

      beforeAll(async () => {
        getMockedFunction(userModule, "findUserByEmail", {
          email: "existing_user@foo.com",
          fscRequest: { requestId: "bar" },
        });
      });

      it("redirects correctly", async () => {
        const args = await getLoaderArgsWithAuthenticatedSession(
          "/fsc/neuBeantragen",
          "existing_user@foo.com",
          undefined,
          fscDataForSession
        );

        const response = await loader(args);

        expect(response.status).toEqual(302);
        expect(response.headers.get("location")).toEqual(
          "/fsc/neuBeantragen/erfolgreich"
        );

        expect(
          (await getSession(response.headers.get("Set-Cookie"))).get("fscData")
        ).toBeUndefined();
      });
    });
  });
});
