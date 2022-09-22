import { getFromErica, postToErica } from "~/erica/ericaClient";
import {
  ericaUtils,
  EricaResponse,
  EricaError,
  EricaFreischaltcodeRequestResponseData,
} from "~/erica/utils";
import invariant from "tiny-invariant";

const createPayloadForNewFreischaltCode = (
  taxIdNumber: string,
  dateOfBirth: string
) => {
  return {
    taxIdNumber: taxIdNumber,
    dateOfBirth: ericaUtils.createDateStringForErica(dateOfBirth),
    taxYear: "2022",
  };
};

export const requestNewFreischaltCode = async (
  taxIdNumber: string,
  dateOfBirth: string
) => {
  const payload = createPayloadForNewFreischaltCode(taxIdNumber, dateOfBirth);
  const result = await postToErica("v2/fsc/request", payload);
  if ("location" in result) {
    return { location: result.location.split("/").reverse()[0] };
  }
  return result;
};

export const checkNewFreischaltCodeRequest = async (requestId: string) => {
  return getFromErica(`v2/fsc/request/${requestId}`);
};

export const extractAntragsId = (
  ericaResponse: EricaResponse
): EricaFreischaltcodeRequestResponseData | EricaError => {
  const result = ericaUtils.extractResultFromEricaResponse(ericaResponse);
  if ("errorCode" in result && result.errorCode) {
    if (
      [
        "ERIC_GLOBAL_PRUEF_FEHLER",
        "ERIC_TRANSFER_ERR_XML_NHEADER",
        "ALREADY_OPEN_UNLOCK_CODE_REQUEST",
      ].includes(result.errorCode)
    ) {
      return {
        errorType: "EricaUserInputError",
        errorMessage: result.errorMessage,
      };
    } else {
      return {
        errorType: "GeneralEricaError",
        errorMessage: result.errorMessage,
      };
    }
  }
  invariant(
    "elsterRequestId" in result,
    "Extracted result from erica response has no ELSTER AntragsId"
  );
  invariant(
    "transferticket" in result,
    "expected transferticket to be in erica result"
  );
  invariant(
    "taxIdNumber" in result,
    "expected taxIdNumber to be in erica result"
  );
  return {
    elsterRequestId: result.elsterRequestId,
    transferticket: result.transferticket,
    taxIdNumber: result.taxIdNumber,
  };
};

export const retrieveAntragsId = async (ericaRequestId: string) => {
  console.log("requesting erica for erica id", ericaRequestId);
  const ericaResponse = await checkNewFreischaltCodeRequest(ericaRequestId);
  console.log("raw erica response", ericaResponse);
  if (ericaResponse && "errorType" in ericaResponse) {
    return ericaResponse;
  } else if (
    ericaResponse &&
    ericaUtils.isEricaRequestProcessed(ericaResponse)
  ) {
    return extractAntragsId(ericaResponse);
  }
};
