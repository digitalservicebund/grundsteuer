import { getFromErica, postToErica } from "./ericaClient";

const mockFetchReturn201 = jest.fn(() =>
  Promise.resolve({
    status: 201,
    headers: new Map([["location", "createdLocation"]]),
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
      jest.spyOn(global, "fetch").mockImplementation(mockFetchReturn201);
      await postToErica("someEndpoint", {});
      expect(mockFetchReturn201.mock.calls[0][0]).toEqual(
        process.env.ERICA_URL + "/someEndpoint"
      );
    });

    it("should return location if receives a 201 from endpoint", async () => {
      jest.spyOn(global, "fetch").mockImplementation(mockFetchReturn201);
      const result = await postToErica("someEndpoint", {});
      expect(result).toEqual("createdLocation");
    });

    it("should send correctly constructed data as JSON string to endpoint", async () => {
      jest.spyOn(global, "fetch").mockImplementation(mockFetchReturn201);
      const actualDataToSend = { name: "Batman", friend: "Robin" };
      await postToErica("someEndpoint", actualDataToSend);
      expect(mockFetchReturn201.mock.calls[0][1]?.body).toEqual(
        JSON.stringify({
          clientIdentifier: "grundsteuer",
          payload: actualDataToSend,
        })
      );
    });

    it("should throw an error if receives a 422 from endpoint", async () => {
      jest.spyOn(global, "fetch").mockImplementation(
        jest.fn(() =>
          Promise.resolve({
            status: 422,
          })
        ) as jest.Mock
      );
      await expect(postToErica("someEndpoint", {})).rejects.toThrow();
    });
    it("should throw an error if receives a 500 from endpoint", async () => {
      jest.spyOn(global, "fetch").mockImplementation(
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

describe("getFromErica", () => {
  const env = process.env;

  beforeEach(() => {
    process.env = { ...env };
  });

  afterEach(() => {
    process.env = env;
  });

  describe("without ERICA_URL set in env", () => {
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
      jest.spyOn(global, "fetch").mockImplementation(mockFetchReturn200);
      await getFromErica("someEndpoint");
      expect(mockFetchReturn200.mock.calls[0][0]).toEqual(
        process.env.ERICA_URL + "/someEndpoint"
      );
    });

    it("should return json result if receives a 200 from endpoint", async () => {
      jest.spyOn(global, "fetch").mockImplementation(mockFetchReturn200);
      const result = await getFromErica("someEndpoint");
      expect(result).toEqual(successObject);
    });
  });
});
