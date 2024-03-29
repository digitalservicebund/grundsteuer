import * as fetchModule from "cross-fetch";
import { getFromErica, postToErica } from "./ericaClient";

jest.mock("cross-fetch", () => {
  return {
    __esModule: true,
    default: jest.fn(() => "mocked!"),
  };
});

const mockFetchReturn201 = jest.fn(() =>
  Promise.resolve({
    status: 201,
    headers: new Map([["location", "createdLocation"]]),
  })
) as jest.Mock;

const mockFetchReturn201NoLocation = jest.fn(() =>
  Promise.resolve({
    status: 201,
  })
) as jest.Mock;

describe("postToErica", () => {
  const env = process.env;

  beforeEach(() => {
    process.env = { ...env };
  });

  afterEach(() => {
    process.env = env;
  });

  describe("with no env variables set", () => {
    it("should fail if only ERICA_URL is not set", async () => {
      await expect(postToErica("someEndpoint", {})).rejects.toThrow();
    });
  });

  describe("with necessary env variables set", () => {
    beforeEach(() => {
      process.env.ERICA_URL = "localhost:8000";
    });

    afterEach(() => {
      mockFetchReturn201.mockClear();
    });

    it("should fetch from correct ericaURl", async () => {
      jest.spyOn(fetchModule, "default").mockImplementation(mockFetchReturn201);
      await postToErica("someEndpoint", {});
      expect(mockFetchReturn201.mock.calls[0][0]).toEqual(
        process.env.ERICA_URL + "/someEndpoint"
      );
    });

    it("should return location if receives a 201 from endpoint", async () => {
      jest.spyOn(fetchModule, "default").mockImplementation(mockFetchReturn201);
      const result = await postToErica("someEndpoint", {});
      expect(result).toEqual({ location: "createdLocation" });
    });

    it("should throw error if receives a 201 from endpoint without location", async () => {
      jest
        .spyOn(fetchModule, "default")
        .mockImplementation(mockFetchReturn201NoLocation);
      await expect(postToErica("someEndpoint", {})).rejects.toThrow();
    });

    it("should send correctly constructed data as JSON string to endpoint", async () => {
      jest.spyOn(fetchModule, "default").mockImplementation(mockFetchReturn201);
      const actualDataToSend = { name: "Batman", friend: "Robin" };
      await postToErica("someEndpoint", actualDataToSend);
      expect(mockFetchReturn201.mock.calls[0][1]?.body).toEqual(
        JSON.stringify({
          clientIdentifier: "grundsteuer",
          payload: actualDataToSend,
        })
      );
    });

    it("should return an error if receives a 422 from endpoint", async () => {
      jest.spyOn(fetchModule, "default").mockImplementation(
        jest.fn(() =>
          Promise.resolve({
            status: 422,
          })
        ) as jest.Mock
      );

      const result = await postToErica("someEndpoint", {});

      await expect(result).toEqual({ error: "EricaWrongFormat" });
    });

    it("should throw an error if receives a 500 from endpoint", async () => {
      jest.spyOn(fetchModule, "default").mockImplementation(
        jest.fn(() =>
          Promise.resolve({
            status: 500,
          })
        ) as jest.Mock
      );
      await expect(postToErica("someEndpoint", {})).rejects.toThrow();
    });
  });
});

const successObject = {
  processStatus: "Success",
  result: { director: "Nolan" },
  errorCode: null,
  errorMessage: null,
};

const mockFetchReturn200 = jest.fn(() =>
  Promise.resolve({
    status: 200,
    headers: new Map([["location", "createdLocation"]]),
    json: () => Promise.resolve(successObject),
  })
) as jest.Mock;

const mockFetchReturn404 = jest.fn(() =>
  Promise.resolve({
    status: 404,
  })
) as jest.Mock;

describe("getFromErica", () => {
  const env = process.env;

  beforeEach(() => {
    process.env = { ...env };
  });

  afterEach(() => {
    process.env = env;
  });

  describe("without ERICA_URL set in env", () => {
    beforeEach(() => {
      process.env.ERICA_URL = undefined;
    });

    afterEach(() => {
      process.env = env;
    });
    it("should fail", async () => {
      await expect(getFromErica("someEndpoint")).rejects.toThrow();
    });
  });

  describe("with ERICA_URL set", () => {
    beforeEach(() => {
      process.env.ERICA_URL = "localhost:8000";
    });

    afterEach(() => {
      process.env = env;
    });

    it("should fetch from correct ericaURl", async () => {
      jest.spyOn(fetchModule, "default").mockImplementation(mockFetchReturn200);
      await getFromErica("someEndpoint");
      expect(mockFetchReturn200.mock.calls[0][0]).toEqual(
        process.env.ERICA_URL + "/someEndpoint"
      );
    });

    it("should return json result if receives a 200 from endpoint", async () => {
      jest.spyOn(fetchModule, "default").mockImplementation(mockFetchReturn200);
      const result = await getFromErica("someEndpoint");
      expect(result).toEqual(successObject);
    });

    it("should return not found error if receives a 404 from endpoint", async () => {
      jest.spyOn(fetchModule, "default").mockImplementation(mockFetchReturn404);
      const result = await getFromErica("someEndpoint");
      expect(result).toEqual({
        errorType: "EricaRequestNotFound",
        errorMessage: "Could not find request",
      });
    });
  });
});
