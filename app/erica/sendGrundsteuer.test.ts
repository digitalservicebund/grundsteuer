import * as ericaClientModule from "~/erica/ericaClient";
import {
  getSuccessResult,
  retrieveResult,
  sendNewGrundsteuer,
} from "~/erica/sendGrundsteuer";
import { grundModelFactory } from "test/factories";

describe("sendNewGrundsteuer", () => {
  it("should return requestId from postToEricaResponse", async () => {
    const mockPostEricaRepsone = jest
      .spyOn(ericaClientModule, "postToErica")
      .mockImplementation(
        jest.fn(() => Promise.resolve("v2/grundsteuer/007")) as jest.Mock
      );
    const requestId = await sendNewGrundsteuer({});
    expect(requestId).toEqual("007");

    mockPostEricaRepsone.mockClear();
  });

  it("should call postToEricaResponse with correct payload", async () => {
    const mockPostEricaRepsone = jest
      .spyOn(ericaClientModule, "postToErica")
      .mockImplementation(
        jest.fn(() => Promise.resolve("v2/grundsteuer/007")) as jest.Mock
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

  it("should return result if status is success", async () => {
    const getResult = {
      processStatus: "Success",
    };
    const mockGetEricaResponsee = jest
      .spyOn(ericaClientModule, "getFromErica")
      .mockImplementation(
        jest.fn(() => Promise.resolve(getResult)) as jest.Mock
      );

    const result = await retrieveResult("007");

    expect(result).toEqual(getResult);

    mockGetEricaResponsee.mockClear();
  });

  it("should return result if status is failure", async () => {
    const getResult = {
      processStatus: "Failure",
    };
    const mockGetEricaResponsee = jest
      .spyOn(ericaClientModule, "getFromErica")
      .mockImplementation(
        jest.fn(() => Promise.resolve(getResult)) as jest.Mock
      );

    const result = await retrieveResult("007");

    expect(result).toEqual(getResult);

    mockGetEricaResponsee.mockClear();
  });
});

describe("getPositiveResult", () => {
  it("throws error if status is processing", () => {
    expect(
      getSuccessResult({
        processStatus: "Processing",
        result: null,
        errorCode: null,
        errorMessage: null,
      })
    ).rejects.toThrow();
  });

  it("throws error if status is failure", () => {
    expect(
      getSuccessResult({
        processStatus: "Failure",
        result: null,
        errorCode: null,
        errorMessage: null,
      })
    ).rejects.toThrow();
  });

  it("throws error if transferticket and pdf not set", () => {
    expect(
      getSuccessResult({
        processStatus: "Success",
        result: {
          transferTicket: "FSC transfer",
          taxIdNumber: "",
          elsterRequestId: "",
        },
        errorCode: null,
        errorMessage: null,
      })
    ).rejects.toThrow();
  });

  it("returns correct data if transferticket and pdf set", async () => {
    const transferticket = "Senden transfer";
    const pdfString = "PDF";
    const result = await getSuccessResult({
      processStatus: "Success",
      result: {
        transfer_ticket: transferticket,
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
});
