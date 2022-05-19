import { getFromErica, postToErica } from "~/erica/ericaClient";
import invariant from "tiny-invariant";
import {
  EricaError,
  EricaFreischaltcodeAktivierenResponseData,
  EricaResponse,
  ericaUtils,
} from "~/erica/utils";

const createPayloadForActivateFreischaltCode = (
  freischalt_code: string,
  elster_request_id: string
) => {
  return {
    taxIdNumber: "UNKOWN",
    freischaltCode: freischalt_code,
    elsterRequestId: elster_request_id,
  };
};

export const activateFreischaltCode = async (
  freischalt_code: string,
  elster_request_id: string
) => {
  const payload = createPayloadForActivateFreischaltCode(
    freischalt_code,
    elster_request_id
  );
  const result = await postToErica("v2/fsc/activation", payload);
  invariant(result, "activateFreischaltCode did not return an ericaRequestId");
  return result.split("/").reverse()[0];
};

export const checkActivateFreischaltCodeRequest = async (requestId: string) => {
  return getFromErica(`v2/fsc/activation/${requestId}`);
};

export const isFscCorrect = (
  ericaResponse: EricaResponse
): EricaFreischaltcodeAktivierenResponseData | EricaError => {
  const result = ericaUtils.extractResultFromEricaResponse(ericaResponse);
  if ("errorCode" in result && result.errorCode) {
    if (
      [
        "ELSTER_REQUEST_ID_UNKNOWN",
        "ERIC_TRANSFER_ERR_XML_NHEADER",
        "ERIC_GLOBAL_PRUEF_FEHLER",
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
    "transferticket" in result,
    "expected transferticket to be in erica result"
  );
  invariant(
    "taxIdNumber" in result,
    "expected taxIdNumber to be in erica result"
  );
  return {
    transferticket: result.transferticket,
    taxIdNumber: result.taxIdNumber,
  };
};

export const checkFreischaltcodeActivation = async (ericaRequestId: string) => {
  const ericaResponse = await checkActivateFreischaltCodeRequest(
    ericaRequestId
  );
  if (ericaResponse && ericaUtils.isEricaRequestProcessed(ericaResponse)) {
    return isFscCorrect(ericaResponse);
  }
};
