import * as ericaClientModule from "./ericaClient";
import {
  extractAntragsId,
  requestNewFreischaltCode,
  retrieveAntragsId,
} from "~/erica/freischaltCodeBeantragen";
import { EricaResponse } from "~/erica/utils";

describe("requestNewFreischaltCode", () => {
  it("should return requestId from postToEricaResponse", async () => {
    const mockPostEricaRepsone = jest
      .spyOn(ericaClientModule, "postToErica")
      .mockImplementation(
        jest.fn(() =>
          Promise.resolve({ location: "v2/fsc/request/007" })
        ) as jest.Mock
      );
    const requestId = await requestNewFreischaltCode("123456789", "01.02.2021");
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
    const requestId = await requestNewFreischaltCode("123456789", "01.02.2021");
    expect(requestId).toEqual({ error: "EricaWrongFormat" });

    mockPostEricaRepsone.mockClear();
  });

  it("should call postToEricaResponse with correct payload", async () => {
    const mockPostEricaRepsone = jest
      .spyOn(ericaClientModule, "postToErica")
      .mockImplementation(
        jest.fn(() =>
          Promise.resolve({ location: "v2/freischalt_code_request/007" })
        ) as jest.Mock
      );
    const inputTaxIdNumber = "123456789";
    const inputDateOfBirth = "01.10.2019";
    const expectedDateOfBirth = "2019-10-01";

    await requestNewFreischaltCode(inputTaxIdNumber, inputDateOfBirth);

    expect(mockPostEricaRepsone.mock.calls[0][1]).toEqual({
      taxIdNumber: inputTaxIdNumber,
      dateOfBirth: expectedDateOfBirth,
      taxYear: "2022",
    });

    mockPostEricaRepsone.mockClear();
  });
});

describe("extractAntragsId", () => {
  const cases = [
    { errorCode: "ALREADY_OPEN_UNLOCK_CODE_REQUEST" },
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
      const result = extractAntragsId(ericaResponseData);
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
    const result = extractAntragsId(ericaResponseData);
    expect(result).toEqual({ errorType: "GeneralEricaError", errorMessage });
  });

  it("should throw EricaUserInputError if ERIC_TRANSFER_ERR_XML_NHEADER present in ericaFreischaltCodeResponse", () => {
    const errorMessage = "Some kind of problem with the NHEADER";
    const ericaResponseData: EricaResponse = {
      processStatus: "Failure",
      result: null,
      errorCode: "ERIC_TRANSFER_ERR_XML_NHEADER",
      errorMessage,
    };
    const result = extractAntragsId(ericaResponseData);
    expect(result).toEqual({ errorType: "EricaUserInputError", errorMessage });
  });

  it("should throw error if no elsterRequestId in result of ericaFreischaltCodeResponse", () => {
    const ericaResponseData: EricaResponse = {
      processStatus: "Failure",
      result: null,
      errorCode: null,
      errorMessage: null,
    };
    expect(() => {
      extractAntragsId(ericaResponseData);
    }).toThrow();
  });

  it("should return AntragsId if successful ericaFreischaltCodeResponse", () => {
    const ericaResult = {
      transferticket: "t1r2a3n4s5f6e7r",
      taxIdNumber: "007",
      elsterRequestId: "123456789",
    };
    const ericaResponseData: EricaResponse = {
      processStatus: "Success",
      result: ericaResult,
      errorCode: null,
      errorMessage: null,
    };

    const foundAntragsID = extractAntragsId(ericaResponseData);

    expect(foundAntragsID).toEqual(ericaResult);
  });
});

describe("retrieveAntragsId", () => {
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
    const result = await retrieveAntragsId("ericaRequestId");
    expect(result).toEqual(expectedError);

    mockGetEricaResponse.mockClear();
  });
});
