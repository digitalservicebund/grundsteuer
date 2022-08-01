import * as ericaClientModule from "./ericaClient";
import { EricaResponse } from "~/erica/utils";
import {
  checkFreischaltcodeRevocation,
  isFscRevoked,
  revokeFreischaltCode,
} from "~/erica/freischaltCodeStornieren";

describe("revokeFreischaltCode", () => {
  it("should return requestId from postToEricaResponse", async () => {
    const mockPostEricaRepsone = jest
      .spyOn(ericaClientModule, "postToErica")
      .mockImplementation(
        jest.fn(() =>
          Promise.resolve({ location: "v2/fsc/revocation/007" })
        ) as jest.Mock
      );
    const requestId = await revokeFreischaltCode("alopekis");
    expect(requestId).toEqual({ location: "007" });

    mockPostEricaRepsone.mockClear();
  });

  it("should return error from postToEricaResponse", async () => {
    const mockPostEricaRepsone = jest
      .spyOn(ericaClientModule, "postToErica")
      .mockImplementation(
        jest.fn(() =>
          Promise.resolve({ error: "EricaWrongFormat" })
        ) as jest.Mock
      );
    const requestId = await revokeFreischaltCode("alopekis");
    expect(requestId).toEqual({ error: "EricaWrongFormat" });

    mockPostEricaRepsone.mockClear();
  });

  it("should call postToEricaResponse with correct payload", async () => {
    const mockPostEricaRepsone = jest
      .spyOn(ericaClientModule, "postToErica")
      .mockImplementation(
        jest.fn(() =>
          Promise.resolve({ location: "v2/fsc/revocation/007" })
        ) as jest.Mock
      );
    const inputEricaRequestId = "russe1terrier";

    await revokeFreischaltCode(inputEricaRequestId);

    expect(mockPostEricaRepsone.mock.calls[0][1]).toEqual({
      elsterRequestId: inputEricaRequestId,
    });

    mockPostEricaRepsone.mockClear();
  });
});

describe("isFscRevoked", () => {
  it("should throw EricaUserInputError if some ELSTER_REQUEST_ID_UNKNOWN present in ericaFreischaltCodeResponse", () => {
    const errorMessage = "Some kind of problem with the NHEADER";
    const ericaResponseData: EricaResponse = {
      processStatus: "Failure",
      result: null,
      errorCode: "ELSTER_REQUEST_ID_UNKNOWN",
      errorMessage,
    };
    const result = isFscRevoked(ericaResponseData);
    expect(result).toEqual({ errorType: "EricaUserInputError", errorMessage });
  });

  it("should throw error if some errorCode present in ericaFreischaltCodeResponse", () => {
    const errorMessage = "Grundsteuer, we still have a problem here";
    const ericaResponseData: EricaResponse = {
      processStatus: "Failure",
      result: null,
      errorCode: "SomeError",
      errorMessage,
    };
    const result = isFscRevoked(ericaResponseData);
    expect(result).toEqual({ errorType: "GeneralEricaError", errorMessage });
  });

  it("should return correct result if successful ericaFreischaltCodeActivateResponse", () => {
    const ericaResult = {
      transferticket: "t1r2a3n4s5f6e7r",
      taxIdNumber: "007",
    };
    const ericaResponseData: EricaResponse = {
      processStatus: "Success",
      result: ericaResult,
      errorCode: null,
      errorMessage: null,
    };

    const result = isFscRevoked(ericaResponseData);

    expect(result).toEqual({
      transferticket: "t1r2a3n4s5f6e7r",
    });
  });
});

describe("checkFreischaltcodeRevocation", () => {
  it("should return error if getFromErica returns error", async () => {
    const expectedError = {
      errorType: "EricaRequestNotFound",
      errorMessage: "Could not find request",
    };
    const mockGetEricaResponse = jest
      .spyOn(ericaClientModule, "getFromErica")
      .mockImplementation(
        jest.fn(() => Promise.resolve(expectedError)) as jest.Mock
      );
    const result = await checkFreischaltcodeRevocation("ericaRequestId");
    expect(result).toEqual(expectedError);

    mockGetEricaResponse.mockClear();
  });
});
