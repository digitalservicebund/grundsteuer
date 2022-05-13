import { mockActionArgs } from "testUtil/mockActionArgs";
import { authenticator } from "~/auth.server";
import { sessionUserFactory } from "test/factories";
import { action, getEricaErrorMessagesFromResponse } from "./zusammenfassung";

jest.mock("~/auth.server", () => {
  return {
    __esModule: true,
    authenticator: {
      isAuthenticated: jest.fn(),
    },
  };
});

const mockIsAuthenticated =
  authenticator.isAuthenticated as jest.MockedFunction<
    typeof authenticator.isAuthenticated
  >;

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
