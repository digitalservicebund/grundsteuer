import {
  createDateStringForErica,
  extractResultFromEricaResponse,
  isEricaRequestProcessed,
} from "~/erica/utils";

describe("createDateStringForErica", () => {
  it("should return correct format", () => {
    expect(createDateStringForErica("01.10.2021")).toEqual("2021-10-01");
  });
});

describe("extractResultFromEricaResponse", () => {
  it("should return object of requestType if status is Success", () => {
    const expectedResult = {
      transferTicket: "C3PO",
      taxIdNumber: "007",
      elsterRequestId: "r2-d2",
    };
    const result = extractResultFromEricaResponse({
      processStatus: "Success",
      result: expectedResult,
      errorCode: null,
      errorMessage: null,
    });
    expect(result).toEqual(expectedResult);
  });

  it("should return error information if status is Failure", () => {
    const result = extractResultFromEricaResponse({
      processStatus: "Failure",
      result: null,
      errorCode: "someErrorOccurred",
      errorMessage: "Grundsteuer, we have a problem.",
    });
    expect(result).toEqual({
      errorCode: "someErrorOccurred",
      errorMessage: "Grundsteuer, we have a problem.",
    });
  });
});

describe("isEricaRequestProcessed", () => {
  it("should return true if status is Success", () => {
    expect(
      isEricaRequestProcessed({
        processStatus: "Success",
        result: null,
        errorCode: null,
        errorMessage: null,
      })
    ).toBeTruthy();
  });

  it("should return true if status is Failure", () => {
    expect(
      isEricaRequestProcessed({
        processStatus: "Success",
        result: null,
        errorCode: null,
        errorMessage: null,
      })
    ).toBeTruthy();
  });

  it("should return false if status is Processing", () => {
    expect(
      isEricaRequestProcessed({
        processStatus: "Processing",
        result: null,
        errorCode: null,
        errorMessage: null,
      })
    ).toBeFalsy();
  });
});
