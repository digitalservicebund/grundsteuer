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

describe("calculateFetchSleep", () => {
  let standardDateNowImplementation: () => number;
  const currentDate = Date.UTC(2022, 11, 31, 0, 0, 61);
  beforeAll(() => {
    standardDateNowImplementation = Date.now;
    Date.now = jest.fn(() => currentDate);
  });

  afterAll(() => {
    Date.now = standardDateNowImplementation;
  });

  it("should return 1 second if time difference below 10s", () => {
    const startTime = Date.UTC(2022, 11, 31, 0, 0, 60);

    const calculatedSleepTime = ericaUtils.calculateFetchSleep(startTime);

    expect(calculatedSleepTime).toBe(1000);
  });
  it("should return 5 second if time difference below 60s", () => {
    const startTime = Date.UTC(2022, 11, 31, 0, 0, 51);

    const calculatedSleepTime = ericaUtils.calculateFetchSleep(startTime);

    expect(calculatedSleepTime).toBe(5000);
  });

  it("should return 10 second if time difference above 60s", () => {
    const startTime = Date.UTC(2022, 11, 31, 0, 0, 1);

    const calculatedSleepTime = ericaUtils.calculateFetchSleep(startTime);

    expect(calculatedSleepTime).toBe(10000);
  });
});
