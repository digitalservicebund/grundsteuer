import * as ericaClientModule from "./ericaClient";
import { EricaResponse } from "~/erica/utils";
import {
  isFscRevoked,
  revokeFreischaltCode,
} from "~/erica/freischaltCodeStornieren";

describe("revokeFreischaltCode", () => {
  it("should return requestId from postToEricaResponse", async () => {
    const mockPostEricaRepsone = jest
      .spyOn(ericaClientModule, "postToErica")
      .mockImplementation(
        jest.fn(() => Promise.resolve("v2/fsc/revocation")) as jest.Mock
      );
    const requestId = await revokeFreischaltCode("alopekis");
    expect(requestId).toEqual("007");

    mockPostEricaRepsone.mockClear();
  });

  it("should call postToEricaResponse with correct payload", async () => {
    const mockPostEricaRepsone = jest
      .spyOn(ericaClientModule, "postToErica")
      .mockImplementation(
        jest.fn(() => Promise.resolve("v2/fsc/revocation/007")) as jest.Mock
      );
    const inputEricaRequestId = "russe1terrier";

    await revokeFreischaltCode(inputEricaRequestId);

    expect(mockPostEricaRepsone.mock.calls[0][1]).toEqual({
      taxIdNumber: "UNKOWN",
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

  it("should return true if successful ericaFreischaltCodeActivateResponse", () => {
    const ericaResponseData: EricaResponse = {
      processStatus: "Success",
      result: {
        transferTicket: "t1r2a3n4s5f6e7r",
        taxIdNumber: "007",
        elsterRequestId: "123456789",
      },
      errorCode: null,
      errorMessage: null,
    };

    const result = isFscRevoked(ericaResponseData);

    expect(result).toBeTruthy();
  });
});
