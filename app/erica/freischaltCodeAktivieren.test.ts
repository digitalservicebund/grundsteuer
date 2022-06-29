import * as ericaClientModule from "./ericaClient";
import {
  activateFreischaltCode,
  isFscCorrect,
} from "~/erica/freischaltCodeAktivieren";
import { EricaResponse } from "~/erica/utils";

describe("activateFreischaltCode", () => {
  it("should return requestId from postToEricaResponse", async () => {
    const mockPostEricaRepsone = jest
      .spyOn(ericaClientModule, "postToErica")
      .mockImplementation(
        jest.fn(() => Promise.resolve("v2/fsc/activate/007")) as jest.Mock
      );
    const requestId = await activateFreischaltCode(
      "AKIT-AINU-1234",
      "alopekis"
    );
    expect(requestId).toEqual("007");

    mockPostEricaRepsone.mockClear();
  });

  it("should call postToEricaResponse with correct payload", async () => {
    const mockPostEricaRepsone = jest
      .spyOn(ericaClientModule, "postToErica")
      .mockImplementation(
        jest.fn(() => Promise.resolve("v2/fsc/activate/007")) as jest.Mock
      );
    const inputFreischaltCode = "COCK-ERSP-ANIEL";
    const inputEricaRequestId = "russe1terrier";

    await activateFreischaltCode(inputFreischaltCode, inputEricaRequestId);

    expect(mockPostEricaRepsone.mock.calls[0][1]).toEqual({
      freischaltCode: inputFreischaltCode,
      elsterRequestId: inputEricaRequestId,
    });

    mockPostEricaRepsone.mockClear();
  });
});

describe("isFscCorrect", () => {
  const cases = [
    { errorCode: "ELSTER_REQUEST_ID_UNKNOWN" },
    { errorCode: "ERIC_TRANSFER_ERR_XML_NHEADER" },
    { errorCode: "ERIC_GLOBAL_PRUEF_FEHLER" },
  ];

  test.each(cases)(
    "Should return EricaUserInputError if $errorCode present in ericaFreischaltCodeResponse",
    async ({ errorCode }) => {
      const errorMessage = "Some kind of problem with the NHEADER";
      const ericaResponseData: EricaResponse = {
        processStatus: "Failure",
        result: null,
        errorCode: errorCode,
        errorMessage,
      };
      const result = isFscCorrect(ericaResponseData);
      expect(result).toEqual({
        errorType: "EricaUserInputError",
        errorMessage,
      });
    }
  );

  it("should return error if some errorCode present in ericaFreischaltCodeResponse", () => {
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

  it("should return correct result if successful ericaFreischaltCodeActivateResponse", () => {
    const expectedTransferticket = "t1r2a3n4s5f6e7r";
    const expectedTaxIdNumber = "123456789";
    const ericaResult = {
      transferticket: expectedTransferticket,
      taxIdNumber: expectedTaxIdNumber,
      elsterRequestId: "007",
    };
    const ericaResponseData: EricaResponse = {
      processStatus: "Success",
      result: ericaResult,
      errorCode: null,
      errorMessage: null,
    };

    const result = isFscCorrect(ericaResponseData);

    expect(result).toEqual({
      transferticket: expectedTransferticket,
      taxIdNumber: expectedTaxIdNumber,
    });
  });
});
