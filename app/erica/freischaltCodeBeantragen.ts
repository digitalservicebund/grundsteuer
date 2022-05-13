import { getFromErica, postToErica } from "~/erica/ericaClient";
import { ericaUtils, EricaResponse, EricaError } from "~/erica/utils";
import invariant from "tiny-invariant";

const createPayloadForNewFreischaltCode = (
  taxIdNumber: string,
  dateOfBirth: string
) => {
  return {
    taxIdNumber: taxIdNumber,
    dateOfBirth: ericaUtils.createDateStringForErica(dateOfBirth),
  };
};

export const requestNewFreischaltCode = async (
  taxIdNumber: string,
  dateOfBirth: string
) => {
  const payload = createPayloadForNewFreischaltCode(taxIdNumber, dateOfBirth);
  const result = await postToErica("v2/fsc/request", payload);
  invariant(
    result,
    "requestNewFreischaltCode did not return an ericaRequestId"
  );
  return result.split("/").reverse()[0];
};

export const checkNewFreischaltCodeRequest = async (requestId: string) => {
  return getFromErica(`v2/fsc/request/${requestId}`);
};

export const extractAntragsId = (
  ericaResponse: EricaResponse
): string | EricaError => {
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
  return result.elsterRequestId;
};

export const retrieveAntragsId = async (ericaRequestId: string) => {
  const ericaResponse = await checkNewFreischaltCodeRequest(ericaRequestId);
  if (ericaResponse && ericaUtils.isEricaRequestProcessed(ericaResponse)) {
    return extractAntragsId(ericaResponse);
  }
};
