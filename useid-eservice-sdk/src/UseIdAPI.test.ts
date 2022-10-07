import axios from "axios";
import { UseIdAPI } from "./UseIdAPI";
import { Identity } from "./Identity";

let useIdAPI: UseIdAPI;
beforeEach(() => {
  useIdAPI = new UseIdAPI("test-api-key", "test-domain");
});

afterEach(() => {
  jest.clearAllMocks();
});

describe("startSession()", () => {
  const tcTokenUrl = "mocked tc token url";
  let axiosPost: jest.SpyInstance;
  beforeEach(() => {
    axiosPost = jest
      .spyOn(axios, "post")
      .mockImplementation(
        jest.fn(() => Promise.resolve({ data: { tcTokenUrl } })) as jest.Mock
      );
  });

  it("should start session and return tcTokenUrl", async () => {
    const response = await useIdAPI.startSession();
    expect(response).toEqual({ tcTokenUrl });
    expect(axiosPost).toHaveBeenCalledWith(
      `${useIdAPI.domain}/api/v1/identification/sessions`
    );
  });
});

describe("getIdentity()", () => {
  const identityValues = { dg1: "dg1", dg2: "dg2" };
  let axiosGet: jest.SpyInstance;
  beforeEach(() => {
    axiosGet = jest
      .spyOn(axios, "get")
      .mockImplementation(
        jest.fn(() => Promise.resolve({ data: identityValues })) as jest.Mock
      );
  });

  it("should start session and return tcTokenUrl", async () => {
    const eIdSessionId = "mocked eIdSessionId";
    const response = await useIdAPI.getIdentity(eIdSessionId);
    expect(response).toEqual(new Identity(identityValues));
    expect(axiosGet).toHaveBeenCalledWith(
      `${useIdAPI.domain}/api/v1/identification/sessions/${eIdSessionId}`
    );
  });
});
