import * as ericaClientModule from "~/erica/ericaClient";
import {
  getSendenResult,
  retrieveResult,
  sendNewGrundsteuer,
} from "~/erica/sendGrundsteuer";
import { grundModelFactory } from "test/factories";

describe("sendNewGrundsteuer", () => {
  it("should return requestId from postToEricaResponse", async () => {
    const mockPostEricaRepsone = jest
      .spyOn(ericaClientModule, "postToErica")
      .mockImplementation(
        jest.fn(() =>
          Promise.resolve({ location: "v2/grundsteuer/007" })
        ) as jest.Mock
      );
    const requestId = await sendNewGrundsteuer({});
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
    const requestId = await sendNewGrundsteuer({});
    expect(requestId).toEqual({ error: "EricaWrongFormat" });

    mockPostEricaRepsone.mockClear();
  });

  it("should call postToEricaResponse with correct payload", async () => {
    const mockPostEricaRepsone = jest
      .spyOn(ericaClientModule, "postToErica")
      .mockImplementation(
        jest.fn(() =>
          Promise.resolve({ location: "v2/grundsteuer/007" })
        ) as jest.Mock
      );
    const expectedData = grundModelFactory
      .grundstueckTyp({ typ: "zweifamilienhaus" })
      .build();

    await sendNewGrundsteuer(expectedData);

    expect(mockPostEricaRepsone.mock.calls[0][1]).toEqual(expectedData);

    mockPostEricaRepsone.mockClear();
  });
});

describe("retrieveResult", () => {
  it("should call getFromErica with correct id", async () => {
    const mockGetEricaResponsee = jest
      .spyOn(ericaClientModule, "getFromErica")
      .mockImplementation(jest.fn(() => Promise.resolve({})) as jest.Mock);
    const expectedData = "007";

    await retrieveResult(expectedData);

    expect(mockGetEricaResponsee.mock.calls[0][0]).toEqual(
      `v2/grundsteuer/${expectedData}`
    );

    mockGetEricaResponsee.mockClear();
  });

  it("should return undefined if status is processing", async () => {
    const mockGetEricaResponsee = jest
      .spyOn(ericaClientModule, "getFromErica")
      .mockImplementation(
        jest.fn(() =>
          Promise.resolve({
            processStatus: "Processing",
          })
        ) as jest.Mock
      );

    const result = await retrieveResult("007");

    expect(result).toBeUndefined();

    mockGetEricaResponsee.mockClear();
  });

  it("should return pdf and transferticket if status is success", async () => {
    const getResult = {
      processStatus: "Success",
      result: {
        pdf: "PDF",
        transferticket: "Transferticket",
      },
    };
    const mockGetEricaResponsee = jest
      .spyOn(ericaClientModule, "getFromErica")
      .mockImplementation(
        jest.fn(() => Promise.resolve(getResult)) as jest.Mock
      );

    const result = await retrieveResult("007");

    expect(result).toEqual({
      pdf: "PDF",
      transferticket: "Transferticket",
    });

    mockGetEricaResponsee.mockClear();
  });

  it("should return error code, message and validation errors if status is failure", async () => {
    const getResult = {
      processStatus: "Failure",
      errorCode: "ErrorCode",
      errorMessage: "Message for youhu",
      result: {
        validationErrors: ["Error 1", "Error 2"],
      },
    };
    const mockGetEricaResponsee = jest
      .spyOn(ericaClientModule, "getFromErica")
      .mockImplementation(
        jest.fn(() => Promise.resolve(getResult)) as jest.Mock
      );

    const result = await retrieveResult("007");

    expect(result).toEqual({
      errorType: "ErrorCode",
      errorMessage: "Message for youhu",
      validationErrors: ["Error 1", "Error 2"],
    });

    mockGetEricaResponsee.mockClear();
  });
});

describe("getSendenResult", () => {
  it("throws error if transferticket and pdf not set", () => {
    expect(
      getSendenResult({
        processStatus: "Success",
        result: null,
        errorCode: null,
        errorMessage: null,
      })
    ).rejects.toThrow();
  });

  it("returns correct data if transferticket and pdf set", async () => {
    const transferticket = "Senden transfer";
    const pdfString = "PDF";
    const result = await getSendenResult({
      processStatus: "Success",
      result: {
        transferticket: transferticket,
        pdf: pdfString,
      },
      errorCode: null,
      errorMessage: null,
    });

    expect(result).toEqual({
      transferticket: transferticket,
      pdf: pdfString,
    });
  });

  it("returns correct data if error returned", async () => {
    const result = await getSendenResult({
      processStatus: "Failure",
      result: {
        validationErrors: ["Error 1", "Error 2"],
      },
      errorCode: "Code",
      errorMessage: "Message",
    });

    expect(result).toEqual({
      errorType: "Code",
      errorMessage: "Message",
      validationErrors: ["Error 1", "Error 2"],
    });
  });
});

describe("retrieveResult", () => {
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
    const result = await retrieveResult("ericaRequestId");
    expect(result).toEqual(expectedError);

    mockGetEricaResponse.mockClear();
  });
});
