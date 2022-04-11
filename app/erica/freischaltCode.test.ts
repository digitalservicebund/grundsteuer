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
  it("should return AntragsId if successfull ericaFreischaltCodeResponse", () => {
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
