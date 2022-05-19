import { validateIsDate } from "~/domain/validation";
import invariant from "tiny-invariant";

type EricaResponse = {
  processStatus: "Processing" | "Success" | "Failure";
  result:
    | EricaFreischaltcodeRequestResponseData
    | EricaFreischaltcodeAktivierenResponseData
    | EricaFreischaltcodeStornierenResponseData
    | EricaSendenResponseData
    | EricaValidationErrorResponseData
    | null;
  errorCode: string | null;
  errorMessage: string[] | string | null;
};

type EricaFreischaltcodeRequestResponseData = {
  transferticket: string;
  taxIdNumber: string;
  elsterRequestId: string;
};

type EricaFreischaltcodeAktivierenResponseData = {
  transferticket: string;
  taxIdNumber: string;
};

type EricaFreischaltcodeStornierenResponseData = {
  transferticket: string;
  elsterRequestId: string;
};

type EricaSendenResponseData = {
  transferticket: string;
  pdf: string;
};

type EricaValidationErrorResponseData = {
  validationErrors: string[];
};

type EricaErrorResponseData = {
  errorCode: string;
  errorMessage: string;
  result?: {
    validationErrors?: string[];
  };
};

type EricaError = {
  errorType: string;
  errorMessage: string;
  validationErrors?: string[];
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
):
  | EricaFreischaltcodeRequestResponseData
  | EricaSendenResponseData
  | EricaErrorResponseData
  | EricaFreischaltcodeAktivierenResponseData
  | EricaFreischaltcodeStornierenResponseData
  | object => {
  if (ericaResponse.processStatus === "Success") {
    return ericaResponse.result ? ericaResponse.result : {};
  }
  return {
    errorCode: ericaResponse.errorCode !== null ? ericaResponse.errorCode : "",
    errorMessage:
      ericaResponse.errorMessage !== null ? ericaResponse.errorMessage : "",
    result: ericaResponse.result !== null ? ericaResponse.result : undefined,
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
  EricaSendenResponseData,
  EricaErrorResponseData,
  EricaFreischaltcodeAktivierenResponseData,
  EricaFreischaltcodeStornierenResponseData,
  EricaError,
};
export const ericaUtils = {
  createDateStringForErica,
  isEricaRequestProcessed,
  extractResultFromEricaResponse,
};
