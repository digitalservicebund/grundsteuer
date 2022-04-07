import { postToErica } from "./ericaClient";

const mockFetchReturn201 = jest.fn(() =>
  Promise.resolve({
    status: 201,
    headers: new Map([["location", "createdLocation"]]),
    json: () => Promise.resolve({}),
  })
) as jest.Mock;

describe("postToErica", () => {
  describe("with no env variables set", () => {
    it("should fail if only ERICA_CLIENT_IDENTIFIER is set", async () => {
      process.env.ERICA_CLIENT_IDENTIFIER = "grundsteuerApp";
      await expect(postToErica("someEndpoint", {})).rejects.toThrow();
    });

    it("should fail if only ERICA_URL is set", async () => {
      process.env.ERICA_URL = "localhost:8000";
      await expect(postToErica("someEndpoint", {})).rejects.toThrow();
    });
  });

  describe("with necessary env variables set", () => {
    beforeEach(() => {
      process.env.ERICA_URL = "localhost:8000";
      process.env.ERICA_CLIENT_IDENTIFIER = "grundsteuerApp";
    });

    afterEach(() => {
      mockFetchReturn201.mockClear();
    });

    it("should return location if receives a 201 from endpoint", async () => {
      jest.spyOn(global, "fetch").mockImplementation(mockFetchReturn201);
      const result = await postToErica("someEndpoint", {});
      expect(result).toEqual("createdLocation");
    });

    it("should send correctly constructed data as JSON string to endpoint", async () => {
      const fetchMock = jest
        .spyOn(global, "fetch")
        .mockImplementation(mockFetchReturn201);
      const actualDataToSend = { name: "Batman", friend: "Robin" };
      await postToErica("someEndpoint", actualDataToSend);
      expect(mockFetchReturn201.mock.calls[0][1]?.body).toEqual(
        JSON.stringify({
          clientIdentifier: process.env.ERICA_CLIENT_IDENTIFIER,
          payload: actualDataToSend,
        })
      );
    });
  });
});
