import { mockIsAuthenticated } from "test/mocks/authenticationMocks";
import { grundModelFactory, sessionUserFactory } from "test/factories";
import * as csrfModule from "~/util/csrf";
import { mockActionArgs } from "testUtil/mockActionArgs";
import { action } from "~/routes/formular/weitereErklaerung";
import { decodeFormDataCookie } from "~/formDataStorage.server";

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

  test("returns validation error if no data given", async () => {
    const args = await mockActionArgs({
      route: "/formular/weitereErklaerung",
      formData: {},
      context: {},
    });
    const result = await action(args);
    expect(result).toEqual({ errors: { datenUebernehmen: "errors.required" } });
  });

  test("redirects to formular start if datenUebernehmen is true", async () => {
    const args = await mockActionArgs({
      route: "/formular/weitereErklaerung",
      formData: { datenUebernehmen: "true" },
      context: {},
    });
    const result = await action(args);
    expect(result.status).toEqual(302);
    expect(result.headers.get("Location")).toEqual("/formular/welcome");
  });

  test("redirects to formular start if datenUebernehmen is false", async () => {
    const args = await mockActionArgs({
      route: "/formular/weitereErklaerung",
      formData: { datenUebernehmen: "false" },
      context: {},
    });
    const result = await action(args);
    expect(result.status).toEqual(302);
    expect(result.headers.get("Location")).toEqual("/formular/welcome");
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

  test("keeps relevant formData if datenUebernehmen is true", async () => {
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
    expect(decodedCookieData).toEqual(
      grundModelFactory
        .eigentuemerPerson({ list: [person1ExpectedData] })
        .build()
    );
  });
});
