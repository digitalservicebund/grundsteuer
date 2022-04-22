import * as ericaClientModule from "./ericaClient";
import {
  extractAntragsId,
  requestNewFreischaltCode,
} from "~/erica/freischaltCode";
import { EricaResponse } from "~/erica/utils";

describe("requestNewFreischaltCode", () => {
  it("should return requestId from postToEricaResponse", async () => {
    const mockPostEricaRepsone = jest
      .spyOn(ericaClientModule, "postToErica")
      .mockImplementation(
        jest.fn(() =>
          Promise.resolve("v2/freischalt_code_request/007")
        ) as jest.Mock
      );
    const requestId = await requestNewFreischaltCode("123456789", "01.02.2021");
    expect(requestId).toEqual("007");

    mockPostEricaRepsone.mockClear();
  });

  it("should call postToEricaResponse with correct payload", async () => {
    const mockPostEricaRepsone = jest
      .spyOn(ericaClientModule, "postToErica")
      .mockImplementation(
        jest.fn(() =>
          Promise.resolve("v2/freischalt_code_request/007")
        ) as jest.Mock
      );
    const expectedTaxIdNumber = "123456789";
    const inputDateOfBirth = "01.10.2019";
    const expectedDateOfBirth = "2019-10-01";

    await requestNewFreischaltCode(expectedTaxIdNumber, inputDateOfBirth);

    expect(mockPostEricaRepsone.mock.calls[0][1]).toEqual({
      taxIdNumber: expectedTaxIdNumber,
      dateOfBirth: expectedDateOfBirth,
    });

    mockPostEricaRepsone.mockClear();
  });
});

describe("extractAntragsId", () => {
  it("should throw error if some errorCode present in ericaFreischaltCodeResponse", () => {
    const ericaResponseData: EricaResponse = {
      processStatus: "Failure",
      result: null,
      errorCode: "SomeError",
      errorMessage: "Grundsteuer, we still have a problem here",
    };
    const result = extractAntragsId(ericaResponseData);
    expect(
        result
    ).toEqual({errorType: "GeneralEricaError"});
  });

  it("should throw EricaUserInputError if some  ERIC_GLOBAL_PRUEF_FEHLER present in ericaFreischaltCodeResponse", () => {
    const ericaResponseData: EricaResponse = {
      processStatus: "Failure",
      result: null,
      errorCode: "ERIC_GLOBAL_PRUEF_FEHLER",
      errorMessage: "Some kind of validation was incorrect",
    };
    const result = extractAntragsId(ericaResponseData);
    expect(
      result
    ).toEqual({errorType: "EricaUserInputError"});
  });

  it("should throw EricaUserInputError if some  ERIC_TRANSFER_ERR_XML_NHEADER present in ericaFreischaltCodeResponse", () => {
    const ericaResponseData: EricaResponse = {
      processStatus: "Failure",
      result: null,
      errorCode: "ERIC_TRANSFER_ERR_XML_NHEADER",
      errorMessage: "Some kind of problem with the NHEADER",
    };
    const result = extractAntragsId(ericaResponseData);
    expect(
      result
    ).toEqual({errorType: "EricaUserInputError"});
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
    const expectedAntragsId = "123456789";
    const ericaResponseData: EricaResponse = {
      processStatus: "Success",
      result: {
        transferTicket: "t1r2a3n4s5f6e7r",
        taxIdNumber: "007",
        elsterRequestId: expectedAntragsId,
      },
      errorCode: null,
      errorMessage: null,
    };

    const foundAntragsID = extractAntragsId(ericaResponseData);

    expect(foundAntragsID).toEqual(expectedAntragsId);
  });
});
