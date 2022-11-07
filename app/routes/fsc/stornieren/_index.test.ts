import { action } from "~/routes/fsc/stornieren/index";
import * as freischaltCodeStornierenModule from "~/erica/freischaltCodeStornieren";
import * as userModule from "~/domain/user";
import { getMockedFunction } from "test/mocks/mockHelper";
import { mockActionArgs } from "testUtil/mockActionArgs";
import * as csrfModule from "~/util/csrf";
import { redis } from "~/redis/redis.server";

describe("action", () => {
  beforeAll(async () => {
    getMockedFunction(csrfModule, "verifyCsrfToken", Promise.resolve());
    getMockedFunction(userModule, "findUserByEmail", {
      email: "existing_user@foo.com",
      fscRequest: { requestId: "foo" },
    });
    jest
      .spyOn(redis, "set")
      .mockImplementation(jest.fn(() => Promise.resolve({})) as jest.Mock);
  });

  afterAll(() => {
    jest.resetAllMocks();
  });

  describe("when starting revocation succeeds", () => {
    it("returns start time for fetcher", async () => {
      const args = await mockActionArgs({
        route: "/fsc/stornieren",
        formData: {},
        context: {},
        email: "existing_user@foo.com",
        allData: {},
      });

      getMockedFunction(freischaltCodeStornierenModule, "revokeFscForUser", {
        location: "strono-erica-id",
      });

      const jsonResponse = await (await action(args)).json();
      expect(jsonResponse.startTime).toBeDefined();
    });
  });

  describe("when starting revocation fails", () => {
    it("returns error message", async () => {
      const args = await mockActionArgs({
        route: "/fsc/stornieren",
        formData: {},
        context: {},
        email: "existing_user@foo.com",
        allData: {},
      });

      getMockedFunction(freischaltCodeStornierenModule, "revokeFscForUser", {
        error: "some error",
      });

      const jsonResponse = await (await action(args)).json();
      expect(jsonResponse.ericaApiError).toBe("some error");
    });
  });
});
