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
} from "./zusammenfassung";
import { getMockedFunction } from "test/mocks/mockHelper";
import * as userModule from "~/domain/user";
import * as validationModule from "~/domain/validation";
import bcrypt from "bcryptjs";
import _ from "lodash";
import * as sendGrundsteuerModule from "~/erica/sendGrundsteuer";

process.env.FORM_COOKIE_SECRET = "secret";

describe("/zusammenfassung loader", () => {
  beforeAll(async () => {
    getMockedFunction(userModule, "findUserByEmail", {
      email: "existing_user@foo.com",
      password: await bcrypt.hash("12345678", 10),
      identified: true,
    });
    mockIsAuthenticated.mockImplementation(() =>
      Promise.resolve(
        sessionUserFactory.build({
          email: "existing_user@foo.com",
          identified: true,
        })
      )
    );
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
    const jsonResponse = await response;

    expect(jsonResponse.previousStepsErrors).toEqual({});
    expect(jsonResponse.ericaErrors).toEqual([]);
    expect(jsonResponse.showSpinner).toBe(false);
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
    const jsonResponse = await response;

    expect(jsonResponse.previousStepsErrors).toEqual(validationErrors);
    expect(jsonResponse.ericaErrors).toEqual([]);
    expect(jsonResponse.showSpinner).toEqual(false);
  });

  describe("Erica Request in Progress", () => {
    beforeEach(async () => {
      jest.clearAllMocks();
      getMockedFunction(userModule, "findUserByEmail", {
        email: "existing_user@foo.com",
        ericaRequestIdSenden: "foo",
        password: await bcrypt.hash("12345678", 10),
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
      const jsonResponse = await response;

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
      });

      it("should remove ericaRequestId and save pdf + transferticket", async () => {
        const spyOnDeleteEricaRequestIdSenden = jest.spyOn(
          userModule,
          "deleteEricaRequestIdSenden"
        );
        const spyOnSavePdf = jest.spyOn(userModule, "savePdf");
        const spyOnSaveTransferticket = jest.spyOn(
          userModule,
          "saveTransferticket"
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
        expect(spyOnSavePdf).toHaveBeenCalledWith(
          "existing_user@foo.com",
          "PDF"
        );
        expect(spyOnSaveTransferticket).toHaveBeenCalledWith(
          "existing_user@foo.com",
          "transfer complete"
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
        const result = await loader(
          await getLoaderArgsWithAuthenticatedSession(
            "/formular/zusammenfassung",
            "existing_user@foo.com"
          )
        );

        expect(result.ericaErrors).toContain("Error 1");
        expect(result.ericaErrors).toContain("Error 2");
      });
    });
  });
});

describe("/zusammenfassung action", () => {
  describe("with an unidentified user", () => {
    beforeAll(() => {
      mockIsAuthenticated.mockImplementation(() =>
        Promise.resolve(sessionUserFactory.build())
      );
    });

    test("throws an error", async () => {
      const args = mockActionArgs({ formData: {}, context: {} });
      await expect(action(args)).rejects.toThrowError("user not identified!");
    });
  });

  describe("with an identified user", () => {
    beforeAll(() => {
      mockIsAuthenticated.mockImplementation(() =>
        Promise.resolve(sessionUserFactory.build({ identified: true }))
      );
    });

    test("does not throw an error", async () => {
      const args = mockActionArgs({ formData: {}, context: {} });
      expect(await action(args)).toMatchObject({ errors: {} });
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

  it("should return validation errors if ERIC_GLOBAL_PRUEF_FEHLER", () => {
    const result = getEricaErrorMessagesFromResponse({
      errorType: "ERIC_GLOBAL_PRUEF_FEHLER",
      errorMessage: "some Error",
      validationErrors: ["Grundsteuer, we have a problem.", "Actually, two."],
    });
    expect(result).toHaveLength(3);
    expect(result).toContain("Grundsteuer, we have a problem.");
    expect(result).toContain("Actually, two.");
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
