type ericaResponseDto = {
  processStatus: "Processing" | "Success" | "Failure";
  result: ericaFreischaltcodeRequestResponseData | null;
  errorCode: string | null;
  errorMessage: string | null;
};

type ericaFreischaltcodeRequestResponseData = {
  transferTicket: string;
  taxIdNumber: string;
  elsterRequestId: string;
};

type ericaErrorResponseData = {
  errorCode: string;
  errorMessage: string;
};

const createDateStringForErica = (dateStringInGermanDateFormat: string) => {
  const splitDate = dateStringInGermanDateFormat.split(".");
  return `${splitDate[2]}-${splitDate[1]}-${splitDate[0]}`;
};

const extractResultFromEricaResponse = (
  ericaResponse: ericaResponseDto
): ericaFreischaltcodeRequestResponseData | ericaErrorResponseData | object => {
  if (ericaResponse.processStatus === "Success") {
    return ericaResponse.result ? ericaResponse.result : {};
  }
  return {
    errorCode: ericaResponse.errorCode !== null ? ericaResponse.errorCode : "",
    errorMessage:
      ericaResponse.errorMessage !== null ? ericaResponse.errorMessage : "",
  };
};

const isEricaRequestProcessed = (ericaResponse: ericaResponseDto) => {
  return (
    ericaResponse.processStatus === "Success" ||
    ericaResponse.processStatus === "Failure"
  );
};
export type {
  ericaResponseDto,
  ericaFreischaltcodeRequestResponseData,
  ericaErrorResponseData,
};
export {
  createDateStringForErica,
  isEricaRequestProcessed,
  extractResultFromEricaResponse,
};
