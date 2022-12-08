import { mockIsAuthenticated } from "test/mocks/authenticationMocks";
import { grundModelFactory, sessionUserFactory } from "test/factories";
import * as csrfModule from "~/util/csrf";
import { mockActionArgs } from "testUtil/mockActionArgs";
import { action } from "~/routes/formular/weitereErklaerung";
import { decodeFormDataCookie } from "~/storage/formDataStorage.server";
import { getMockedFunction } from "test/mocks/mockHelper";
import * as userModule from "~/domain/user";
import { getSession } from "~/session.server";

describe("/weitereErklaerung action", () => {
  beforeAll(async () => {
    mockIsAuthenticated.mockImplementation(() =>
      Promise.resolve(sessionUserFactory.build({ id: "1" }))
    );
    const csrfMock = jest.spyOn(csrfModule, "verifyCsrfToken");
    csrfMock.mockImplementation(() => Promise.resolve());
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });

  describe("with identified user with pdf and transferticket", () => {
    beforeAll(async () => {
      getMockedFunction(userModule, "findUserByEmail", {
        email: "existing_user@foo.com",
        identified: true,
        pdf: new Buffer("PDF"),
        transferticket: "TT",
      });
    });

    afterAll(() => {
      jest.restoreAllMocks();
    });

    describe("without data given", () => {
      test("returns validation error", async () => {
        const args = await mockActionArgs({
          route: "/formular/weitereErklaerung",
          formData: {},
          context: {},
        });
        const result = await action(args);
        expect(result).toEqual({
          errors: { datenUebernehmen: "errors.required" },
        });
      });

      test("keeps pdf and transferticket", async () => {
        const args = await mockActionArgs({
          route: "/formular/weitereErklaerung",
          formData: {},
          context: {},
        });
        const deletePdfMock = getMockedFunction(userModule, "deletePdf", () =>
          Promise.resolve()
        );
        const deleteTransferticketMock = getMockedFunction(
          userModule,
          "deleteTransferticket",
          () => Promise.resolve()
        );

        try {
          await action(args);
          expect(deletePdfMock.mock.calls.length).toBe(0);
          expect(deleteTransferticketMock.mock.calls.length).toBe(0);
        } finally {
          deletePdfMock.mockRestore();
          deleteTransferticketMock.mockRestore();
        }
      });

      test("keeps inDeclarationProcess", async () => {
        const setFlagMock = getMockedFunction(
          userModule,
          "setUserInDeclarationProcess",
          () => Promise.resolve()
        );
        const args = await mockActionArgs({
          route: "/formular/weitereErklaerung",
          formData: {},
          context: {},
        });

        try {
          const result = await action(args);

          expect(setFlagMock).not.toBeCalled();
          // No cookies means no overridden session
          expect(result.headers).toBeUndefined();
        } finally {
          setFlagMock.mockRestore();
        }
      });
    });

    describe("with datenUebernehmen true", () => {
      test("redirects to pruefen start", async () => {
        const args = await mockActionArgs({
          route: "/formular/weitereErklaerung",
          formData: { datenUebernehmen: "true" },
          context: {},
        });

        const result = await action(args);

        expect(result.status).toEqual(302);
        expect(result.headers.get("Location")).toEqual(
          "/pruefen/start?weitereErklaerung=true"
        );
      });

      test("deletes pdf and transferticket", async () => {
        const deletePdfMock = getMockedFunction(userModule, "deletePdf", () =>
          Promise.resolve()
        );
        const deleteTransferticketMock = getMockedFunction(
          userModule,
          "deleteTransferticket",
          () => Promise.resolve()
        );
        const args = await mockActionArgs({
          route: "/formular/weitereErklaerung",
          formData: { datenUebernehmen: "true" },
          context: {},
        });

        try {
          await action(args);

          expect(deletePdfMock.mock.calls.length).toBe(1);
          expect(deleteTransferticketMock.mock.calls.length).toBe(1);
        } finally {
          deletePdfMock.mockRestore();
          deleteTransferticketMock.mockRestore();
        }
      });

      test("sets inDeclarationProcess to true", async () => {
        const setFlagMock = getMockedFunction(
          userModule,
          "setUserInDeclarationProcess",
          () => Promise.resolve()
        );
        const args = await mockActionArgs({
          route: "/formular/weitereErklaerung",
          formData: { datenUebernehmen: "true" },
          context: {},
        });

        try {
          await action(args);

          expect(setFlagMock).toBeCalledTimes(1);
          expect(setFlagMock).toHaveBeenCalledWith("user@example.com", true);
        } finally {
          setFlagMock.mockRestore();
        }
      });

      test("sets inDeclarationProcess to true in session", async () => {
        const args = await mockActionArgs({
          route: "/formular/weitereErklaerung",
          formData: { datenUebernehmen: "true" },
          context: {},
        });

        const result = await action(args);

        const resultingSession = await getSession(
          result.headers.get("Set-Cookie").replace(",", ";")
        );
        expect(resultingSession.get("user").inDeclarationProcess).toEqual(true);
      });

      test("keeps relevant formData", async () => {
        const person1ExpectedData = {
          persoenlicheAngaben: {
            anrede: "frau" as const,
            titel: "",
            vorname: "Vorname",
            name: "Name",
            geburtsdatum: "01.01.1980",
          },
          adresse: { ort: "Ort", plz: "12345" },
          steuerId: { steuerId: "" },
          gesetzlicherVertreter: { hasVertreter: "true" as const },
          vertreter: {
            persoenlicheAngaben: {
              anrede: "herr" as const,
              titel: "Prof.",
              vorname: "Vert Vorname",
              name: "Vert Name",
              geburtsdatum: "02.02.1980",
            },
            adresse: { ort: "Ort", plz: "12345" },
          },
        };
        const fullExpectedData = grundModelFactory
          .eigentuemerPerson({ list: [person1ExpectedData] })
          .build();
        delete fullExpectedData.testFeaturesEnabled;
        const fullPerson1Data = {
          ...person1ExpectedData,
          ...{ anteil: { zaehler: "2", nenner: "3" } },
        };
        const args = await mockActionArgs({
          route: "/formular/weitereErklaerung",
          formData: { datenUebernehmen: "true" },
          allData: grundModelFactory
            .full()
            .eigentuemerPerson({ list: [fullPerson1Data, fullPerson1Data] })
            .build(),
          context: {},
        });

        const result = await action(args);

        const decodedCookieData = await decodeFormDataCookie({
          cookieHeader: result.headers.get("Set-Cookie"),
          user: sessionUserFactory.build({ id: "1" }),
        });
        expect(decodedCookieData).toEqual(fullExpectedData);
      });
    });

    describe("with datenUebernehmen false", () => {
      test("redirects to pruefen start", async () => {
        const args = await mockActionArgs({
          route: "/formular/weitereErklaerung",
          formData: { datenUebernehmen: "false" },
          context: {},
        });
        const result = await action(args);
        expect(result.status).toEqual(302);
        expect(result.headers.get("Location")).toEqual(
          "/pruefen/start?weitereErklaerung=true"
        );
      });

      test("deletes pdf and transferticket", async () => {
        const args = await mockActionArgs({
          route: "/formular/weitereErklaerung",
          formData: { datenUebernehmen: "false" },
          context: {},
        });
        const deletePdfMock = getMockedFunction(userModule, "deletePdf", () =>
          Promise.resolve()
        );
        const deleteTransferticketMock = getMockedFunction(
          userModule,
          "deleteTransferticket",
          () => Promise.resolve()
        );
        try {
          await action(args);
          expect(deletePdfMock.mock.calls.length).toBe(1);
          expect(deleteTransferticketMock.mock.calls.length).toBe(1);
        } finally {
          deletePdfMock.mockRestore();
          deleteTransferticketMock.mockRestore();
        }
      });

      test("sets inDeclarationProcess to true", async () => {
        const setFlagMock = getMockedFunction(
          userModule,
          "setUserInDeclarationProcess",
          () => Promise.resolve()
        );
        const args = await mockActionArgs({
          route: "/formular/weitereErklaerung",
          formData: { datenUebernehmen: "false" },
          context: {},
        });

        try {
          await action(args);

          expect(setFlagMock).toBeCalledTimes(1);
          expect(setFlagMock).toHaveBeenCalledWith("user@example.com", true);
        } finally {
          setFlagMock.mockRestore();
        }
      });

      test("sets inDeclarationProcess to true in session", async () => {
        const args = await mockActionArgs({
          route: "/formular/weitereErklaerung",
          formData: { datenUebernehmen: "false" },
          context: {},
        });

        const result = await action(args);

        const resultingSession = await getSession(
          result.headers.get("Set-Cookie").replace(",", ";")
        );
        expect(resultingSession.get("user").inDeclarationProcess).toEqual(true);
      });

      test("clears formData if datenUebernehmen is false", async () => {
        const args = await mockActionArgs({
          route: "/formular/weitereErklaerung",
          formData: { datenUebernehmen: "false" },
          allData: grundModelFactory.full().build(),
          context: {},
        });
        const result = await action(args);
        const decodedCookieData = await decodeFormDataCookie({
          cookieHeader: result.headers.get("Set-Cookie"),
          user: sessionUserFactory.build({ id: "1" }),
        });
        expect(decodedCookieData).toEqual({});
      });
    });
  });
});
