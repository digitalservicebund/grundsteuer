import { mockActionArgs } from "testUtil/mockActionArgs";
import { mockIsAuthenticated } from "test/mocks/authenticationMocks";
import { grundModelFactory, sessionUserFactory } from "test/factories";
import * as csrfModule from "~/util/csrf";
import * as modelModule from "~/domain/model";
import { action } from "~/routes/formular/_step";

process.env.FORM_COOKIE_SECRET = "secret";

describe("_step action", () => {
  beforeEach(async () => {
    mockIsAuthenticated.mockImplementation(() =>
      Promise.resolve(sessionUserFactory.build({ id: "1" }))
    );
    const csrfMock = jest.spyOn(csrfModule, "verifyCsrfToken");
    csrfMock.mockImplementation(() => Promise.resolve());
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test("Returns error if fields not filled", async () => {
    const args = await mockActionArgs({
      route: "/grundstueck/typ",
      formData: {},
      context: {},
      userEmail: "user@example.com",
      allData: grundModelFactory.full().build(),
    });

    const result = await action(args);

    expect(Object.keys(result.errors)).toHaveLength(1);
  });

  test("Does not update data if fields not filled", async () => {
    const spyOnSetStepData = jest.spyOn(modelModule, "setStepData");
    const args = await mockActionArgs({
      route: "/grundstueck/typ",
      formData: {},
      context: {},
      userEmail: "user@example.com",
      allData: grundModelFactory.full().build(),
    });

    await action(args);

    expect(spyOnSetStepData).not.toHaveBeenCalled();
  });

  test("Updates data if fields filled", async () => {
    const spyOnSetStepData = jest.spyOn(modelModule, "setStepData");
    const previousData = grundModelFactory.full().build();
    const args = await mockActionArgs({
      route: "/grundstueck/typ",
      formData: {
        typ: "einfamilienhaus",
        additional: "Should not be in result",
      },
      context: {},
      userEmail: "user@example.com",
      allData: previousData,
    });

    await action(args);

    expect(spyOnSetStepData).toHaveBeenCalledTimes(1);
    expect(spyOnSetStepData).toHaveBeenCalledWith(
      previousData,
      "grundstueck.typ",
      {
        typ: "einfamilienhaus",
      }
    );
  });
});
