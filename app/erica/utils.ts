import { validateIsDate } from "~/domain/validation";
import invariant from "tiny-invariant";

type EricaResponse = {
  processStatus: "Processing" | "Success" | "Failure";
  result: EricaFreischaltcodeRequestResponseData | null;
  errorCode: string | null;
  errorMessage: string[] | string | null;
};

type EricaFreischaltcodeRequestResponseData = {
  transferTicket: string;
  taxIdNumber: string;
  elsterRequestId: string;
};

type EricaErrorResponseData = {
  errorCode: string;
  errorMessage: string;
};

type EricaError = {
  errorType: string;
  errorMessage: string;
};

const createDateStringForErica = (dateStringInGermanDateFormat: string) => {
  invariant(
    validateIsDate({ value: dateStringInGermanDateFormat }),
    "date is not in incorrect format"
  );
  const splitDate = dateStringInGermanDateFormat.split(".");
  return `${splitDate[2]}-${splitDate[1]}-${splitDate[0]}`;
};
const extractResultFromEricaResponse = (
  ericaResponse: EricaResponse
): EricaFreischaltcodeRequestResponseData | EricaErrorResponseData | object => {
  if (ericaResponse.processStatus === "Success") {
    return ericaResponse.result ? ericaResponse.result : {};
  }
  return {
    errorCode: ericaResponse.errorCode !== null ? ericaResponse.errorCode : "",
    errorMessage:
      ericaResponse.errorMessage !== null ? ericaResponse.errorMessage : "",
  };
};

const isEricaRequestProcessed = (ericaResponse: EricaResponse) => {
  return (
    ericaResponse.processStatus === "Success" ||
    ericaResponse.processStatus === "Failure"
  );
};
export type {
  EricaResponse,
  EricaFreischaltcodeRequestResponseData,
  EricaErrorResponseData,
  EricaError,
};
export const ericaUtils = {
  createDateStringForErica,
  isEricaRequestProcessed,
  extractResultFromEricaResponse,
};
