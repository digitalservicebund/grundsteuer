import { getFromErica, postToErica } from "~/erica/ericaClient";
import invariant from "tiny-invariant";
import { EricaError, EricaResponse, ericaUtils } from "~/erica/utils";

const createPayloadForRevokeFreischaltCode = (elster_request_id: string) => {
  return {
    taxIdNumber: "UNKOWN",
    elsterRequestId: elster_request_id,
  };
};

export const revokeFreischaltCode = async (elster_request_id: string) => {
  const payload = createPayloadForRevokeFreischaltCode(elster_request_id);
  const result = await postToErica("v2/fsc/revocation", payload);
  invariant(result, "revokeFreischaltCode did not return an ericaRequestId");
  return result.split("/").reverse()[0];
};

export const checkRevokeFreischaltCodeRequest = async (requestId: string) => {
  return getFromErica(`v2/fsc/revocation/${requestId}`);
};

export const isFscRevoked = (
  ericaResponse: EricaResponse
): boolean | EricaError => {
  const result = ericaUtils.extractResultFromEricaResponse(ericaResponse);
  if ("errorCode" in result && result.errorCode) {
    if (result.errorCode == "ELSTER_REQUEST_ID_UNKNOWN") {
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
  return true;
};

export const checkFreischaltcodeRevocation = async (ericaRequestId: string) => {
  const ericaResponse = await checkRevokeFreischaltCodeRequest(ericaRequestId);
  if (ericaResponse && ericaUtils.isEricaRequestProcessed(ericaResponse)) {
    return isFscRevoked(ericaResponse);
  }
};
