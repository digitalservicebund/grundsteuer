import { ericaUtils } from "~/erica/utils";

describe("createDateStringForErica", () => {
  it("should throw error if incorrect format", () => {
    expect(() => {
      ericaUtils.createDateStringForErica("01/10/2021");
    }).toThrow();
  });

  it("should throw error if no date", () => {
    expect(() => {
      ericaUtils.createDateStringForErica("NoDate");
    }).toThrow();
  });

  it("should return correct format", () => {
    expect(ericaUtils.createDateStringForErica("01.10.2021")).toEqual(
      "2021-10-01"
    );
  });
});

describe("extractResultFromEricaResponse", () => {
  it("should return object of requestType if status is Success", () => {
    const expectedResult = {
      transferticket: "C3PO",
      taxIdNumber: "007",
      elsterRequestId: "r2-d2",
    };
    const result = ericaUtils.extractResultFromEricaResponse({
      processStatus: "Success",
      result: expectedResult,
      errorCode: null,
      errorMessage: null,
    });
    expect(result).toEqual(expectedResult);
  });

  it("should return error information if status is Failure", () => {
    const result = ericaUtils.extractResultFromEricaResponse({
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

describe("getEricaErrorsFromResponse", () => {
  it("should return empty list if no errorMessage set", () => {
    const result = ericaUtils.getEricaErrorsFromResponse({
      processStatus: "Success",
      result: {
        transferticket: "C3PO",
        taxIdNumber: "007",
        elsterRequestId: "r2-d2",
      },
      errorCode: null,
      errorMessage: null,
    });
    expect(result).toEqual([]);
  });

  it("should return error information if errors present as string", () => {
    const result = ericaUtils.getEricaErrorsFromResponse({
      processStatus: "Failure",
      result: null,
      errorCode: "someErrorOccurred",
      errorMessage: "Grundsteuer, we have a problem.",
    });
    expect(result).toEqual(["Grundsteuer, we have a problem."]);
  });

  it("should return error information if validation errors given", () => {
    const result = ericaUtils.getEricaErrorsFromResponse({
      processStatus: "Failure",
      result: {
        validationErrors: ["Grundsteuer, we have a problem.", "Actually, two."],
      },
      errorCode: "someErrorOccurred",
      errorMessage: "some Error",
    });
    expect(result).toEqual([
      "Grundsteuer, we have a problem.",
      "Actually, two.",
    ]);
  });
});

describe("isEricaRequestProcessed", () => {
  it("should return true if status is Success", () => {
    expect(
      ericaUtils.isEricaRequestProcessed({
        processStatus: "Success",
        result: null,
        errorCode: null,
        errorMessage: null,
      })
    ).toBeTruthy();
  });

  it("should return true if status is Failure", () => {
    expect(
      ericaUtils.isEricaRequestProcessed({
        processStatus: "Failure",
        result: null,
        errorCode: null,
        errorMessage: null,
      })
    ).toBeTruthy();
  });

  it("should return false if status is Processing", () => {
    expect(
      ericaUtils.isEricaRequestProcessed({
        processStatus: "Processing",
        result: null,
        errorCode: null,
        errorMessage: null,
      })
    ).toBeFalsy();
  });
});
