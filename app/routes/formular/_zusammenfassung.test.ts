import { mockActionArgs } from "testUtil/mockActionArgs";
import {
  getLoaderArgsWithAuthenticatedSession,
  mockIsAuthenticated,
} from "test/mocks/authenticationMocks";
import { grundModelFactory, sessionUserFactory } from "test/factories";
import {
  action,
  getEricaErrorMessagesFromResponse,
  loader,
  saveConfirmationAuditLogs,
} from "./zusammenfassung";
import { getMockedFunction } from "test/mocks/mockHelper";
import * as userModule from "~/domain/user";
import * as auditLogModule from "~/audit/auditLog";
import * as validationModule from "~/domain/validation";
import _ from "lodash";
import * as sendGrundsteuerModule from "~/erica/sendGrundsteuer";
import * as csrfModule from "~/util/csrf";
import { AuditLogEvent } from "~/audit/auditLog";
import * as modelModule from "~/domain/model";
import { getSession } from "~/session.server";

describe("/zusammenfassung loader", () => {
  beforeAll(async () => {
    getMockedFunction(userModule, "findUserByEmail", {
      email: "existing_user@foo.com",
      identified: true,
    });
    mockIsAuthenticated.mockImplementation(() =>
      Promise.resolve(
        sessionUserFactory.build({
          id: "1",
          email: "existing_user@foo.com",
          identified: true,
        })
      )
    );
  });

  afterAll(async () => {
    jest.restoreAllMocks();
  });

  it("should return default values for correct data", async () => {
    const fullData = _.merge(grundModelFactory.full().build(), {
      zusammenfassung: {
        confirmCompleteCorrect: "true",
        confirmDataPrivacy: "true",
        confirmTermsOfUse: "true",
      },
    });

    const response = await loader(
      await getLoaderArgsWithAuthenticatedSession(
        "/formular/zusammenfassung",
        "existing_user@foo.com",
        fullData
      )
    );
    const jsonResponse = await response.json();

    expect(jsonResponse.previousStepsErrors).toEqual({});
    expect(jsonResponse.ericaErrors).toEqual([]);
    expect(jsonResponse.showSpinner).toBe(false);
  });

  it("should keep null values from arrays as empty objects in return data ", async () => {
    const fullData = _.merge(grundModelFactory.full().build(), {
      zusammenfassung: {
        confirmCompleteCorrect: "true",
        confirmDataPrivacy: "true",
        confirmTermsOfUse: "true",
      },
    });
    let personData;
    const generatedPersonData = grundModelFactory
      .eigentuemerPerson({
        list: [
          {
            steuerId: {
              steuerId: "22 222 222 222",
            },
          },
        ],
      })
      .build().eigentuemer?.person;
    if (
      fullData.eigentuemer &&
      generatedPersonData &&
      generatedPersonData.length > 0
    ) {
      personData = [{}, generatedPersonData[0]];
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      fullData.eigentuemer.person = [null, generatedPersonData[0]];
    }
    const options = await getLoaderArgsWithAuthenticatedSession(
      "/formular/zusammenfassung",
      "existing_user@foo.com",
      fullData
    );
    const response = await loader(options);
    const jsonResponse = await response.json();
    expect(jsonResponse.allData.eigentuemer.person).toEqual(personData);
  });

  it("should return previousStepsErrors if errors in previous steps", async () => {
    const validationErrors = { field: "error" };
    getMockedFunction(
      validationModule,
      "validateAllStepsData",
      validationErrors
    );
    const response = await loader(
      await getLoaderArgsWithAuthenticatedSession(
        "/formular/zusammenfassung",
        "existing_user@foo.com"
      )
    );
    const jsonResponse = await response.json();

    expect(jsonResponse.previousStepsErrors).toEqual(validationErrors);
    expect(jsonResponse.ericaErrors).toEqual([]);
    expect(jsonResponse.showSpinner).toEqual(false);
  });

  describe("Erica Request in Progress", () => {
    beforeEach(async () => {
      getMockedFunction(userModule, "findUserByEmail", {
        email: "existing_user@foo.com",
        ericaRequestIdSenden: "foo",
        identified: true,
      });
      getMockedFunction(sendGrundsteuerModule, "retrieveResult", undefined);
    });

    it("should return inProgress true", async () => {
      const response = await loader(
        await getLoaderArgsWithAuthenticatedSession(
          "/formular/zusammenfassung",
          "existing_user@foo.com"
        )
      );
      const jsonResponse = await response.json();

      expect(jsonResponse.showSpinner).toEqual(true);
    });

    it("should call correct erica function", async () => {
      const spyOnEricaFunction = jest.spyOn(
        sendGrundsteuerModule,
        "retrieveResult"
      );

      await loader(
        await getLoaderArgsWithAuthenticatedSession(
          "/formular/zusammenfassung",
          "existing_user@foo.com"
        )
      );

      expect(spyOnEricaFunction).toHaveBeenCalled();
    });

    describe("Erica finished with Success", () => {
      beforeEach(async () => {
        getMockedFunction(sendGrundsteuerModule, "retrieveResult", {
          transferticket: "transfer complete",
          pdf: "PDF",
        });
        getMockedFunction(userModule, "saveDeclaration", {});
      });

      it("should remove ericaRequestId and save pdf + transferticket", async () => {
        const spyOnDeleteEricaRequestIdSenden = jest.spyOn(
          userModule,
          "deleteEricaRequestIdSenden"
        );
        const spyOnSaveDeclaration = jest.spyOn(userModule, "saveDeclaration");

        await loader(
          await getLoaderArgsWithAuthenticatedSession(
            "/formular/zusammenfassung",
            "existing_user@foo.com"
          )
        );

        expect(spyOnDeleteEricaRequestIdSenden).toHaveBeenCalledWith(
          "existing_user@foo.com"
        );
        expect(spyOnSaveDeclaration).toHaveBeenCalledWith(
          "existing_user@foo.com",
          "transfer complete",
          "PDF"
        );
      });

      it("should set inDeclarationProcess to false", async () => {
        const spyOnSetUserInDeclarationProcess = jest.spyOn(
          userModule,
          "setUserInDeclarationProcess"
        );

        try {
          await loader(
            await getLoaderArgsWithAuthenticatedSession(
              "/formular/zusammenfassung",
              "existing_user@foo.com"
            )
          );

          expect(spyOnSetUserInDeclarationProcess).toHaveBeenCalledWith(
            "existing_user@foo.com",
            false
          );
        } finally {
          spyOnSetUserInDeclarationProcess.mockRestore();
        }
      });

      it("should set inDeclarationProcess to false in session", async () => {
        const result = await loader(
          await getLoaderArgsWithAuthenticatedSession(
            "/formular/zusammenfassung",
            "existing_user@foo.com"
          )
        );

        const resultingSession = await getSession(
          result.headers.get("Set-Cookie")
        );
        expect(resultingSession.get("user").inDeclarationProcess).toEqual(
          false
        );
      });

      it("should redirect to /formular/erfolg", async () => {
        const response = await loader(
          await getLoaderArgsWithAuthenticatedSession(
            "/formular/zusammenfassung",
            "existing_user@foo.com"
          )
        );

        expect(response.headers.get("Location")).toEqual("/formular/erfolg");
      });
    });

    describe("Erica finished with not found error", () => {
      beforeEach(async () => {
        getMockedFunction(sendGrundsteuerModule, "retrieveResult", {
          errorType: "EricaRequestNotFound",
          errorMessage: "We could not find the request",
        });
      });

      it("should remove ericaRequestId", async () => {
        const spyOnDeleteEricaRequestIdSenden = jest.spyOn(
          userModule,
          "deleteEricaRequestIdSenden"
        );

        await loader(
          await getLoaderArgsWithAuthenticatedSession(
            "/formular/zusammenfassung",
            "existing_user@foo.com"
          )
        );

        expect(spyOnDeleteEricaRequestIdSenden).toHaveBeenCalledWith(
          "existing_user@foo.com"
        );
      });

      it("should return error messages", async () => {
        const response = await loader(
          await getLoaderArgsWithAuthenticatedSession(
            "/formular/zusammenfassung",
            "existing_user@foo.com"
          )
        );

        const jsonResponse = await response.json();

        expect(jsonResponse.ericaErrors).toContain(
          "Es ist ein Fehler aufgetreten. Bitte versuchen Sie es noch einmal."
        );
      });

      it("should not set inDeclarationProcess", async () => {
        const spyOnSetUserInDeclarationProcess = jest.spyOn(
          userModule,
          "setUserInDeclarationProcess"
        );

        try {
          const result = await loader(
            await getLoaderArgsWithAuthenticatedSession(
              "/formular/zusammenfassung",
              "existing_user@foo.com"
            )
          );

          expect(spyOnSetUserInDeclarationProcess).not.toHaveBeenCalled();
          const resultingSession = await getSession(
            result.headers.get("Set-Cookie")
          );
          expect(resultingSession.get("user").inDeclarationProcess).toEqual(
            undefined
          );
        } finally {
          spyOnSetUserInDeclarationProcess.mockRestore();
        }
      });
    });

    describe("Erica finished with errors", () => {
      beforeEach(async () => {
        getMockedFunction(sendGrundsteuerModule, "retrieveResult", {
          errorType: "ERIC_GLOBAL_PRUEF_FEHLER",
          errorMessage: "Some not very nice error message",
          validationErrors: ["Error 1", "Error 2"],
        });
      });

      it("should remove ericaRequestId", async () => {
        const spyOnDeleteEricaRequestIdSenden = jest.spyOn(
          userModule,
          "deleteEricaRequestIdSenden"
        );

        await loader(
          await getLoaderArgsWithAuthenticatedSession(
            "/formular/zusammenfassung",
            "existing_user@foo.com"
          )
        );

        expect(spyOnDeleteEricaRequestIdSenden).toHaveBeenCalledWith(
          "existing_user@foo.com"
        );
      });

      it("should return error messages", async () => {
        const response = await loader(
          await getLoaderArgsWithAuthenticatedSession(
            "/formular/zusammenfassung",
            "existing_user@foo.com"
          )
        );

        const jsonResponse = await response.json();

        expect(jsonResponse.ericaErrors).toContain("Error 1");
        expect(jsonResponse.ericaErrors).toContain("Error 2");
      });

      it("should not set inDeclarationProcess", async () => {
        const spyOnSetUserInDeclarationProcess = jest.spyOn(
          userModule,
          "setUserInDeclarationProcess"
        );

        try {
          const result = await loader(
            await getLoaderArgsWithAuthenticatedSession(
              "/formular/zusammenfassung",
              "existing_user@foo.com"
            )
          );

          expect(spyOnSetUserInDeclarationProcess).not.toHaveBeenCalled();
          const resultingSession = await getSession(
            result.headers.get("Set-Cookie")
          );
          expect(resultingSession.get("user").inDeclarationProcess).toEqual(
            undefined
          );
        } finally {
          spyOnSetUserInDeclarationProcess.mockRestore();
        }
      });
    });
  });
});

describe("/zusammenfassung action", () => {
  describe("with an unidentified user", () => {
    beforeAll(async () => {
      mockIsAuthenticated.mockImplementation(() =>
        Promise.resolve(sessionUserFactory.build())
      );
      getMockedFunction(userModule, "findUserByEmail", {
        email: "existing_user@foo.com",
        identified: false,
      });
      const csrfMock = jest.spyOn(csrfModule, "verifyCsrfToken");
      csrfMock.mockImplementation(() => Promise.resolve());
    });

    afterAll(() => {
      jest.restoreAllMocks();
    });

    test("throws an error", async () => {
      const args = await mockActionArgs({ formData: {}, context: {} });
      await expect(action(args)).rejects.toThrowError("user not identified!");
    });
  });

  describe("with an identified user", () => {
    beforeAll(async () => {
      mockIsAuthenticated.mockImplementation(() =>
        Promise.resolve(sessionUserFactory.build({ identified: true, id: "1" }))
      );
      getMockedFunction(userModule, "findUserByEmail", {
        email: "existing_user@foo.com",
        identified: true,
      });
      const csrfMock = jest.spyOn(csrfModule, "verifyCsrfToken");
      csrfMock.mockImplementation(() => Promise.resolve());
    });

    afterAll(() => {
      jest.restoreAllMocks();
    });

    test("does not throw an error", async () => {
      const args = await mockActionArgs({ formData: {}, context: {} });
      expect(await action(args)).toMatchObject({ errors: {} });
    });

    test("Returns error if fields not filled", async () => {
      const args = await mockActionArgs({
        formData: {},
        context: {},
        email: "user@example.com",
        allData: grundModelFactory.full().build(),
      });

      const result = await action(args);

      expect(Object.keys(result.errors)).toHaveLength(3);
    });

    test("Does not update data if fields not filled", async () => {
      const spyOnSetStepData = jest.spyOn(modelModule, "setStepData");
      const args = await mockActionArgs({
        formData: {},
        context: {},
        email: "user@example.com",
        allData: grundModelFactory.full().build(),
      });

      await action(args);

      expect(spyOnSetStepData).not.toHaveBeenCalled();
    });

    test("Updates data if fields filled", async () => {
      getMockedFunction(sendGrundsteuerModule, "sendNewGrundsteuer", {
        location: "ericaRequestId",
      });
      const spyOnSetStepData = jest.spyOn(modelModule, "setStepData");
      const previousData = grundModelFactory.full().build();
      const args = await mockActionArgs({
        formData: {
          confirmCompleteCorrect: "true",
          confirmDataPrivacy: "true",
          confirmTermsOfUse: "true",
          freitext: "Freitext",
          additional: "Should not be in result",
        },
        context: {},
        email: "user@example.com",
        allData: previousData,
      });

      await action(args);

      expect(spyOnSetStepData).toHaveBeenCalledTimes(1);
      expect(spyOnSetStepData).toHaveBeenCalledWith(
        previousData,
        "zusammenfassung",
        {
          confirmCompleteCorrect: "true",
          confirmDataPrivacy: "true",
          confirmTermsOfUse: "true",
          freitext: "Freitext",
        }
      );
    });

    test("does not save confirmation audit logs when fields not filled", async () => {
      const spyOnSaveAuditLog = jest.spyOn(auditLogModule, "saveAuditLog");
      const args = await mockActionArgs({
        formData: {},
        context: {},
        allData: grundModelFactory.full().build(),
      });

      await action(args);

      expect(spyOnSaveAuditLog).toHaveBeenCalledTimes(0);
    });

    test("saves confirmation audit logs when filled correctly", async () => {
      getMockedFunction(sendGrundsteuerModule, "sendNewGrundsteuer", {
        location: "ericaRequestId",
      });
      const spyOnSaveAuditLog = jest.spyOn(auditLogModule, "saveAuditLog");
      const args = await mockActionArgs({
        formData: {
          confirmCompleteCorrect: "true",
          confirmDataPrivacy: "true",
          confirmTermsOfUse: "true",
        },
        context: {},
        email: "user@example.com",
        allData: grundModelFactory.full().build(),
      });

      await action(args);

      expect(spyOnSaveAuditLog).toHaveBeenCalledTimes(3);
    });

    test("sends new grundsteuer", async () => {
      const sendGrundsteuerMock = getMockedFunction(
        sendGrundsteuerModule,
        "sendNewGrundsteuer",
        { location: "ericaRequestId" }
      );
      const args = await mockActionArgs({
        formData: {
          confirmCompleteCorrect: "true",
          confirmDataPrivacy: "true",
          confirmTermsOfUse: "true",
        },
        context: {},
        email: "user@example.com",
        allData: grundModelFactory.full().build(),
      });
      sendGrundsteuerMock.mockClear();

      await action(args);

      expect(sendGrundsteuerMock).toHaveBeenCalledTimes(1);
    });

    test("returns error if grundsteuer sending returns error", async () => {
      const sendGrundsteuerMock = getMockedFunction(
        sendGrundsteuerModule,
        "sendNewGrundsteuer",
        { error: "EricaWrongFormat" }
      );
      const args = await mockActionArgs({
        formData: {
          confirmCompleteCorrect: "true",
          confirmDataPrivacy: "true",
          confirmTermsOfUse: "true",
        },
        context: {},
        email: "user@example.com",
        allData: grundModelFactory.full().build(),
      });
      sendGrundsteuerMock.mockClear();

      const result = await action(args);

      expect(await result.json()).toEqual({
        ericaApiError: "EricaWrongFormat",
      });
    });

    test("does not send new grundsteuer if already in progress", async () => {
      const sendGrundsteuerMock = getMockedFunction(
        sendGrundsteuerModule,
        "sendNewGrundsteuer",
        { location: "ericaRequestId" }
      );
      const findUserMock = getMockedFunction(userModule, "findUserByEmail", {
        email: "existing_user@foo.com",
        identified: true,
        ericaRequestIdSenden: "senden-id",
      });
      const args = await mockActionArgs({
        formData: {
          confirmCompleteCorrect: "true",
          confirmDataPrivacy: "true",
          confirmTermsOfUse: "true",
        },
        context: {},
        email: "user@example.com",
        allData: grundModelFactory.full().build(),
      });
      sendGrundsteuerMock.mockClear();

      try {
        await action(args);

        expect(sendGrundsteuerMock).not.toHaveBeenCalled();
      } finally {
        findUserMock.mockRestore();
      }
    });
  });
});

describe("getEricaErrorMessagesFromResponse", () => {
  const cases = [
    { errorCode: "ERIC_GLOBAL_BUFANR_UNBEKANNT" },
    { errorCode: "INVALID_BUFA_NUMBER" },
    { errorCode: "INVALID_TAX_NUMBER" },
    { errorCode: "ERIC_GLOBAL_STEUERNUMMER_UNGUELTIG" },
    { errorCode: "ERIC_GLOBAL_EWAZ_UNGUELTIG" },
  ];

  test.each(cases)(
    "Should return correct error message if error code is $errorCode",
    async ({ errorCode }) => {
      const result = getEricaErrorMessagesFromResponse({
        errorType: errorCode,
        errorMessage: "Grundsteuer, we have a problem.",
        validationErrors: undefined,
      });
      expect(result).toHaveLength(1);
      expect(result[0]).toContain("Steuernummer");
    }
  );

  it("should return correct error message if error is not found", () => {
    const result = getEricaErrorMessagesFromResponse({
      errorType: "EricaRequestNotFound",
      errorMessage: "We could not find the request.",
      validationErrors: undefined,
    });
    expect(result).toHaveLength(1);
    expect(result[0]).toContain(
      "Es ist ein Fehler aufgetreten. Bitte versuchen Sie es noch einmal."
    );
  });

  it("should return validation errors if ERIC_GLOBAL_PRUEF_FEHLER", () => {
    const validationErrors = [
      "Grundsteuer, we have a problem.",
      "Actually, two.",
    ];
    const result = getEricaErrorMessagesFromResponse({
      errorType: "ERIC_GLOBAL_PRUEF_FEHLER",
      errorMessage: "some Error",
      validationErrors,
    });
    expect(result).toEqual(validationErrors);
  });

  it("should return general error message if ERIC_GLOBAL_PRUEF_FEHLER but no validation errors", () => {
    const result = getEricaErrorMessagesFromResponse({
      errorType: "ERIC_GLOBAL_PRUEF_FEHLER",
      errorMessage: "some Error",
    });
    expect(result).toHaveLength(1);
  });

  it("should raise error if error code is unexpected", async () => {
    await expect(async () => {
      getEricaErrorMessagesFromResponse({
        errorType: "SOME_ERROR",
        errorMessage: "some Error",
      });
    }).rejects.toThrow("Unexpected Error");
  });
});

describe("saveConfirmationAuditLogs", () => {
  it("Throws error if confirmCompleteCorrect not set", async () => {
    await expect(async () => {
      await saveConfirmationAuditLogs("IP", "usermail@bar.com", {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        zusammenfassung: {
          confirmDataPrivacy: "true",
          confirmTermsOfUse: "true",
        },
      });
    }).rejects.toThrow();
  });

  it("Throws error if confirmDataPrivacy not set", async () => {
    await expect(async () => {
      await saveConfirmationAuditLogs("IP", "usermail@bar.com", {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        zusammenfassung: {
          confirmCompleteCorrect: "true",
          confirmTermsOfUse: "true",
        },
      });
    }).rejects.toThrow();
  });

  it("Throws error if confirmTermsOfUse not set", async () => {
    await expect(async () => {
      await saveConfirmationAuditLogs("IP", "usermail@bar.com", {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        zusammenfassung: {
          confirmCompleteCorrect: "true",
          confirmDataPrivacy: "true",
        },
      });
    }).rejects.toThrow();
  });

  it("Calls saveAuditLog with correct parameters", async () => {
    const spyOnSaveAuditLog = jest.spyOn(auditLogModule, "saveAuditLog");
    const ip = "IP";
    const mail = "usermail@bar.com";
    const value = "true";
    const time = 1652856662;

    const actualNowImplementation = Date.now;
    try {
      Date.now = jest.fn(() => time);
      await saveConfirmationAuditLogs(ip, mail, {
        zusammenfassung: {
          confirmCompleteCorrect: value,
          confirmDataPrivacy: value,
          confirmTermsOfUse: value,
        },
      });
    } finally {
      Date.now = actualNowImplementation;
    }

    const standardParams = {
      timestamp: time,
      ipAddress: ip,
      username: mail,
      eventData: {
        value: value,
      },
    };
    expect(spyOnSaveAuditLog).toHaveBeenCalledTimes(3);
    expect(spyOnSaveAuditLog).toHaveBeenNthCalledWith(1, {
      ...standardParams,
      eventName: AuditLogEvent.CONFIRMED_COMPLETE_CORRECT,
    });
    expect(spyOnSaveAuditLog).toHaveBeenNthCalledWith(2, {
      ...standardParams,
      eventName: AuditLogEvent.CONFIRMED_DATA_PRIVACY,
    });
    expect(spyOnSaveAuditLog).toHaveBeenNthCalledWith(3, {
      ...standardParams,
      eventName: AuditLogEvent.CONFIRMED_TERMS_OF_USE,
    });
  });
});
