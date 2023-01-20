import { action, loader } from "~/routes/fsc/eingeben/index";
import { getSession } from "~/session.server";
import * as freischaltCodeAktivierenModule from "~/erica/freischaltCodeAktivieren";
import * as freischaltCodeStornierenModule from "~/erica/freischaltCodeStornieren";
import * as userModule from "~/domain/user";
import * as lifecycleModule from "~/domain/lifecycleEvents.server";
import { sessionUserFactory } from "test/factories";
import {
  getLoaderArgsWithAuthenticatedSession,
  mockIsAuthenticated,
} from "test/mocks/authenticationMocks";
import { getMockedFunction } from "test/mocks/mockHelper";
import * as csrfModule from "~/util/csrf";
import { mockActionArgs } from "testUtil/mockActionArgs";
import { DataFunctionArgs } from "@remix-run/node";
import { redis } from "~/redis/redis.server";

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
    jest
      .spyOn(redis, "set")
      .mockImplementation(jest.fn(() => Promise.resolve({})) as jest.Mock);
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterAll(() => {
    jest.clearAllMocks();
  });

  describe("with unidentified user", () => {
    describe("FscRequest createdAt", () => {
      beforeAll(() => {
        getMockedFunction(
          freischaltCodeAktivierenModule,
          "checkFreischaltcodeActivation",
          {
            transferticket: expectedTransferticket,
            taxIdNumber: expectedTaxIdNumber,
          }
        );
      });

      const cases = [
        {
          createdAt: new Date(),
          description: "same day",
          expectedRemainingDays: 90,
        },
        {
          createdAt: new Date(new Date().setDate(new Date().getDate() - 89)),
          description: "89 days ago",
          expectedRemainingDays: 1,
        },
      ];

      test.each(cases)(
        "should return $expectedRemainingDays remaining days on $description",
        async ({ createdAt, expectedRemainingDays }) => {
          getMockedFunction(userModule, "findUserByEmail", {
            email: "existing_user@foo.com",
            ericaRequestIdFscAktivieren: "foo",
            fscRequest: {
              requestId: "elster-request-id",
              createdAt: createdAt,
            },
          });

          const response = await loader(
            await getLoaderArgsWithAuthenticatedSession(
              "/fsc/eingeben",
              "existing_user@foo.com"
            )
          );
          const jsonResponse = await response.json();

          expect(jsonResponse.remainingDays).toBe(expectedRemainingDays);
        }
      );
    });

    describe("erica activation sends success", () => {
      beforeAll(() => {
        getMockedFunction(
          freischaltCodeAktivierenModule,
          "checkFreischaltcodeActivation",
          {
            transferticket: expectedTransferticket,
            taxIdNumber: expectedTaxIdNumber,
          }
        );
      });

      beforeEach(async () => {
        getMockedFunction(userModule, "findUserByEmail", {
          email: "existing_user@foo.com",
          ericaRequestIdFscAktivieren: "foo",
          fscRequest: { requestId: "elster-request-id", createdAt: new Date() },
        });
      });

      it("should be inProgress", async () => {
        const response = await loader(
          await getLoaderArgsWithAuthenticatedSession(
            "/fsc/eingeben",
            "existing_user@foo.com"
          )
        );
        const jsonResponse = await response.json();

        expect(jsonResponse.showSpinner).toBe(true);
      });

      it("should call lifecycle event", async () => {
        const expectedClientIp = "123.007";
        const spyOnLifecycleEvent = jest.spyOn(
          lifecycleModule,
          "saveSuccessfulFscActivationData"
        );
        const args = await getLoaderArgsWithAuthenticatedSession(
          "/fsc/eingeben",
          "existing_user@foo.com"
        );
        args.context.clientIp = expectedClientIp;

        await loader(args);

        expect(spyOnLifecycleEvent).toHaveBeenCalledWith(
          "existing_user@foo.com",
          "foo",
          expectedClientIp,
          expectedTransferticket
        );
      });

      it("should set identified in session", async () => {
        const response = await loader(
          await getLoaderArgsWithAuthenticatedSession(
            "/fsc/eingeben",
            "existing_user@foo.com"
          )
        );

        const session = await getSession(response.headers.get("Set-Cookie"));

        expect(session.get("user").identified).toBe(true);
      });

      it("sets inFscEingebenProcess to false", async () => {
        const spyOnsetInProcessMock = jest.spyOn(
          userModule,
          "setUserInFscEingebenProcess"
        );
        await loader(
          await getLoaderArgsWithAuthenticatedSession(
            "/fsc/eingeben",
            "existing_user@foo.com"
          )
        );
        expect(spyOnsetInProcessMock).toHaveBeenCalledWith(
          "existing_user@foo.com",
          false
        );
      });
    });

    describe("erica activation sends unexpected error", () => {
      beforeAll(() => {
        getMockedFunction(
          freischaltCodeAktivierenModule,
          "checkFreischaltcodeActivation",
          {
            errorType: "GeneralEricaError",
            errorMessage: "We found some problem",
          }
        );
      });

      beforeEach(async () => {
        getMockedFunction(userModule, "findUserByEmail", {
          email: "existing_user@foo.com",
          ericaRequestIdFscAktivieren: "foo",
          fscRequest: { requestId: "elster-request-id", createdAt: new Date() },
        });
      });

      it("should throw error", async () => {
        const args = await getLoaderArgsWithAuthenticatedSession(
          "/fsc/eingeben",
          "existing_user@foo.com"
        );

        await expect(async () => await loader(args)).rejects.toThrow(
          "We found some problem"
        );
      });

      it("should not call lifecycle event", async () => {
        const args = await getLoaderArgsWithAuthenticatedSession(
          "/fsc/eingeben",
          "existing_user@foo.com"
        );
        const spyOnLifecycleEvent = jest.spyOn(
          lifecycleModule,
          "saveSuccessfulFscActivationData"
        );

        try {
          await loader(args);
        } catch {
          expect(spyOnLifecycleEvent).not.toHaveBeenCalled();
        }
      });

      it("should not start revocation process", async () => {
        const revokeSpy = jest.spyOn(
          freischaltCodeStornierenModule,
          "revokeFscForUser"
        );
        const args = await getLoaderArgsWithAuthenticatedSession(
          "/fsc/eingeben",
          "existing_user@foo.com"
        );
        try {
          await loader(args);
        } catch {
          expect(revokeSpy).not.toHaveBeenCalled();
        }
      });

      it("sets inFscEingebenProcess to false", async () => {
        const spyOnsetInProcessMock = jest.spyOn(
          userModule,
          "setUserInFscEingebenProcess"
        );
        const args = await getLoaderArgsWithAuthenticatedSession(
          "/fsc/eingeben",
          "existing_user@foo.com"
        );
        try {
          await loader(args);
        } catch {
          expect(spyOnsetInProcessMock).toHaveBeenCalledWith(
            "existing_user@foo.com",
            false
          );
        }
      });
    });

    describe("erica activation sends expected error", () => {
      beforeAll(() => {
        getMockedFunction(
          freischaltCodeAktivierenModule,
          "checkFreischaltcodeActivation",
          {
            errorType: "EricaUserInputError",
            errorMessage: "ELSTER_REQUEST_ID_UNKNOWN",
          }
        );
      });

      beforeEach(async () => {
        getMockedFunction(userModule, "findUserByEmail", {
          email: "existing_user@foo.com",
          ericaRequestIdFscAktivieren: "foo",
          fscRequest: { requestId: "elster-request-id", createdAt: new Date() },
        });
      });

      it("should not call lifecycle event", async () => {
        const args = await getLoaderArgsWithAuthenticatedSession(
          "/fsc/eingeben",
          "existing_user@foo.com"
        );
        const spyOnLifecycleEvent = jest.spyOn(
          lifecycleModule,
          "saveSuccessfulFscActivationData"
        );

        try {
          await loader(args);
        } catch {
          expect(spyOnLifecycleEvent).not.toHaveBeenCalled();
        }
      });

      it("should not start revocation process", async () => {
        const revokeSpy = jest.spyOn(
          freischaltCodeStornierenModule,
          "revokeFscForUser"
        );
        const args = await getLoaderArgsWithAuthenticatedSession(
          "/fsc/eingeben",
          "existing_user@foo.com"
        );
        try {
          await loader(args);
        } catch {
          expect(revokeSpy).not.toHaveBeenCalled();
        }
      });

      it("sets inFscEingebenProcess to false", async () => {
        const spyOnsetInProcessMock = jest.spyOn(
          userModule,
          "setUserInFscEingebenProcess"
        );
        const args = await getLoaderArgsWithAuthenticatedSession(
          "/fsc/eingeben",
          "existing_user@foo.com"
        );
        try {
          await loader(args);
        } catch {
          expect(spyOnsetInProcessMock).toHaveBeenCalledWith(
            "existing_user@foo.com",
            false
          );
        }
      });

      it("shows error and no spinner", async () => {
        const args = await getLoaderArgsWithAuthenticatedSession(
          "/fsc/eingeben",
          "existing_user@foo.com"
        );
        const result = await loader(args);
        expect(result.showError).toEqual(true);
        expect(result.showSpinner).toEqual(false);
      });
    });

    describe("erica activation sends already activated", () => {
      beforeAll(() => {
        getMockedFunction(
          freischaltCodeAktivierenModule,
          "checkFreischaltcodeActivation",
          {
            errorType: "AlreadyActivatedFsc",
            errorMessage: "ALREADY_ACTIVATED_UNLOCK_CODE",
          }
        );
      });

      beforeEach(async () => {
        getMockedFunction(userModule, "findUserByEmail", {
          email: "existing_user@foo.com",
          ericaRequestIdFscAktivieren: "foo",
          fscRequest: { requestId: "elster-request-id", createdAt: new Date() },
        });
      });

      it("should not call lifecycle event", async () => {
        const args = await getLoaderArgsWithAuthenticatedSession(
          "/fsc/eingeben",
          "existing_user@foo.com"
        );
        const spyOnLifecycleEvent = jest.spyOn(
          lifecycleModule,
          "saveSuccessfulFscActivationData"
        );

        await loader(args);

        expect(spyOnLifecycleEvent).not.toHaveBeenCalled();
      });

      it("should not start revocation process", async () => {
        const revokeSpy = jest.spyOn(
          freischaltCodeStornierenModule,
          "revokeFscForUser"
        );
        const args = await getLoaderArgsWithAuthenticatedSession(
          "/fsc/eingeben",
          "existing_user@foo.com"
        );

        await loader(args);

        expect(revokeSpy).not.toHaveBeenCalled();
      });

      it("sets inFscEingebenProcess to false", async () => {
        const spyOnsetInProcessMock = jest.spyOn(
          userModule,
          "setUserInFscEingebenProcess"
        );
        const args = await getLoaderArgsWithAuthenticatedSession(
          "/fsc/eingeben",
          "existing_user@foo.com"
        );

        await loader(args);

        expect(spyOnsetInProcessMock).toHaveBeenCalledTimes(1);
        expect(spyOnsetInProcessMock).toHaveBeenCalledWith(
          "existing_user@foo.com",
          false
        );
      });

      it("deletes correct fsc", async () => {
        const spyOnDeleteFscMock = jest.spyOn(userModule, "deleteFscRequest");
        const args = await getLoaderArgsWithAuthenticatedSession(
          "/fsc/eingeben",
          "existing_user@foo.com"
        );

        await loader(args);

        expect(spyOnDeleteFscMock).toHaveBeenCalledTimes(1);
        expect(spyOnDeleteFscMock).toHaveBeenCalledWith(
          "existing_user@foo.com"
        );
      });

      it("redirects to /fehler", async () => {
        const args = await getLoaderArgsWithAuthenticatedSession(
          "/fsc/eingeben",
          "existing_user@foo.com"
        );
        const result = await loader(args);
        expect(result.status).toEqual(302);
        expect(result.headers.get("Location")).toEqual("/fsc/eingeben/fehler");
      });
    });

    describe("erica activation sends not found error", () => {
      beforeAll(() => {
        getMockedFunction(
          freischaltCodeAktivierenModule,
          "checkFreischaltcodeActivation",
          {
            errorType: "EricaRequestNotFound",
            errorMessage: "Could not find request",
          }
        );
      });

      it("should delete erica request id", async () => {
        const args = await getLoaderArgsWithAuthenticatedSession(
          "/fsc/eingeben",
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

      it("should throw", async () => {
        const args = await getLoaderArgsWithAuthenticatedSession(
          "/fsc/eingeben",
          "existing_user@foo.com"
        );
        await expect(async () => {
          await loader(args);
        }).rejects.toThrow();
      });
    });
  });

  describe("with identified user", () => {
    beforeEach(async () => {
      getMockedFunction(userModule, "findUserByEmail", {
        email: "existing_user@foo.com",
        ericaRequestIdFscStornieren: "foo",
        fscRequest: { requestId: "foo", createdAt: new Date() },
        identified: true,
      });
    });

    it("should redirect to success page", async () => {
      const args = await getLoaderArgsWithAuthenticatedSession(
        "/fsc/eingeben",
        "existing_user@foo.com"
      );
      const result = await loader(args);
      expect(result.status).toEqual(302);
      expect(result.headers.get("Location")).toEqual("/identifikation");
    });
  });
});

describe("Action", () => {
  beforeAll(async () => {
    jest
      .spyOn(redis, "set")
      .mockImplementation(jest.fn(() => Promise.resolve({})) as jest.Mock);
    getMockedFunction(csrfModule, "verifyCsrfToken", Promise.resolve());
    mockIsAuthenticated.mockImplementation(() =>
      Promise.resolve(
        sessionUserFactory.build({
          email: "existing_user@foo.com",
        })
      )
    );
  });
  afterAll(() => {
    jest.restoreAllMocks();
  });

  test("Returns startTime if eingeben in progress", async () => {
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

        test("sets inFscEingebenProcess to true", async () => {
          const spyOnsetInProcessMock = jest.spyOn(
            userModule,
            "setUserInFscEingebenProcess"
          );
          await action(correctArgs);
          expect(spyOnsetInProcessMock).toHaveBeenCalledWith(
            "existing_user@foo.com",
            true
          );
        });

        test("returns startTime", async () => {
          const result = await action(correctArgs);
          expect((await result.json()).startTime).not.toBeUndefined();
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
