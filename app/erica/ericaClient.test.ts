import { postToErica } from "./ericaClient";

const mockFetchReturn201 = jest.fn(() =>
  Promise.resolve({
    status: 201,
    headers: new Map([["location", "createdLocation"]]),
    json: () => Promise.resolve({}),
  })
) as jest.Mock;

describe("postToErica", () => {
  describe("with no ERICA_URL in env", () => {
    it("should fail", async () => {
      await expect(postToErica("someEndpoint")).rejects.toThrow();
    });
  });

  describe("with no ERICA_URL in env", () => {
    beforeEach(() => {
      process.env.ERICA_URL = "localhost:8000";
    });

    it("should return location if receives a 201 from endpoint", async () => {
      jest.spyOn(global, "fetch").mockImplementation(mockFetchReturn201);
      const result = await postToErica("someEndpoint");
      expect(result).toEqual("createdLocation");
    });
  });
});
