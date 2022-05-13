import { mockActionArgs } from "testUtil/mockActionArgs";
import { authenticator } from "~/auth.server";
import { sessionUserFactory } from "test/factories";
import { action } from "./zusammenfassung";

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
