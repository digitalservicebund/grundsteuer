import { validateIsDate } from "~/domain/validation";
import invariant from "tiny-invariant";

type EricaResponse = {
  processStatus: "Processing" | "Success" | "Failure";
  result:
    | EricaFreischaltcodeRequestResponseData
    | EricaFreischaltcodeRevocationResponseData
    | EricaSendenResponseData
    | null;
  errorCode: string | null;
  errorMessage: string[] | string | null;
};

type EricaFreischaltcodeRequestResponseData = {
  transferticket: string;
  taxIdNumber: string;
  elsterRequestId: string;
};

type EricaFreischaltcodeRevocationResponseData = {
  transferticket: string;
  taxIdNumber: string;
};

type EricaSendenResponseData = {
  transferticket: string;
  pdf: string;
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

const getEricaErrorsFromResponse = (ericaRespons: EricaResponse): string[] => {
  const result = ericaUtils.extractResultFromEricaResponse(ericaRespons);
  if (!("errorMessage" in result)) return [];
  const errorMessage = result.errorMessage;
  return Array.isArray(errorMessage) ? errorMessage : [errorMessage];
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
  getEricaErrorsFromResponse,
};
