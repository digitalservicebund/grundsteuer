import { mockActionArgs } from "testUtil/mockActionArgs";
import * as csrfModule from "~/util/csrf";
import * as modelModule from "~/domain/model";
import { action, getMachine } from "./_step";
import { saveToPruefenStateCookie } from "~/storage/pruefenCookie.server";
import { PRUEFEN_START_PATH } from "~/routes/__infoLayout/pruefen/_pruefenPath.server";

describe("_step action", () => {
  beforeEach(async () => {
    const csrfMock = jest.spyOn(csrfModule, "verifyCsrfToken");
    csrfMock.mockImplementation(() => Promise.resolve());
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test("Redirects to first step if no state set in cookie", async () => {
    const args = await mockActionArgs({
      route: "/eigentuemerTyp",
      formData: {},
      context: {},
      email: "user@example.com",
      allData: {},
    });

    const result = await action(args);

    expect(result.status).toEqual(302);
    expect(result.headers.get("location")).toEqual(PRUEFEN_START_PATH);
  });

  describe("With state in cookie", () => {
    let explicitCookie = "";

    beforeAll(async () => {
      explicitCookie = await saveToPruefenStateCookie(
        getMachine({ formData: {} }).getInitialState("bundesland")
      );
    });

    test("Returns error if fields not filled", async () => {
      const args = await mockActionArgs({
        route: "/bundesland",
        formData: {},
        context: {},
        email: "user@example.com",
        allData: {},
        explicitCookie,
      });

      const result = await action(args);

      expect(Object.keys(result.errors)).toHaveLength(1);
    });

    test("Does not update data if fields not filled", async () => {
      const spyOnSetStepData = jest.spyOn(modelModule, "setStepData");
      const args = await mockActionArgs({
        route: "/bundesland",
        formData: {},
        context: {},
        email: "user@example.com",
        allData: {},
        explicitCookie,
      });

      await action(args);

      expect(spyOnSetStepData).not.toHaveBeenCalled();
    });

    test("Updates data if fields filled", async () => {
      const spyOnSetStepData = jest.spyOn(modelModule, "setStepData");
      const previousData = {};
      const args = await mockActionArgs({
        route: "/bundesland",
        formData: {
          bundesland: "BE",
          additional: "Should not be in result",
        },
        context: {},
        email: "user@example.com",
        allData: previousData,
        explicitCookie,
      });

      await action(args);

      expect(spyOnSetStepData).toHaveBeenCalledTimes(1);
      expect(spyOnSetStepData).toHaveBeenCalledWith(
        previousData,
        "bundesland",
        {
          bundesland: "BE",
        }
      );
    });
  });
});
