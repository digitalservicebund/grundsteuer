import * as ericaClientModule from "./ericaClient";
import {activateFreischaltCode, isFscCorrect} from "~/erica/freischaltCodeAktivieren";
import {EricaResponse} from "~/erica/utils";

describe("activateFreischaltCode", () => {
  it("should return requestId from postToEricaResponse", async () => {
    const mockPostEricaRepsone = jest
      .spyOn(ericaClientModule, "postToErica")
      .mockImplementation(
        jest.fn(() =>
          Promise.resolve("v2/fsc/request/007")
        ) as jest.Mock
      );
    const requestId = await activateFreischaltCode("AKIT-AINU-1234", "alopekis");
    expect(requestId).toEqual("007");

    mockPostEricaRepsone.mockClear();
  });

  it("should call postToEricaResponse with correct payload", async () => {
    const mockPostEricaRepsone = jest
      .spyOn(ericaClientModule, "postToErica")
      .mockImplementation(
        jest.fn(() =>
          Promise.resolve("v2/fsc/activate/007")
        ) as jest.Mock
      );
    const inputFreischaltCode = "COCK-ERSP-ANIEL";
    const inputEricaRequestId = "russe1terrier";

    await activateFreischaltCode(inputFreischaltCode, inputEricaRequestId);

    expect(mockPostEricaRepsone.mock.calls[0][1]).toEqual({
      taxIdNumber: "UNKOWN",
      freischaltCode: inputFreischaltCode,
      elsterRequestId: inputEricaRequestId
    });

    mockPostEricaRepsone.mockClear();
  });
});

describe("isFscCorrect", () => {
  it("should throw error if some errorCode present in ericaFreischaltCodeResponse", () => {
    const errorMessage = "Grundsteuer, we still have a problem here";
    const ericaResponseData: EricaResponse = {
      processStatus: "Failure",
      result: null,
      errorCode: "SomeError",
      errorMessage,
    };
    const result = isFscCorrect(ericaResponseData);
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

    const result = isFscCorrect(ericaResponseData);

    expect(result).toBeTruthy();
  });
});
