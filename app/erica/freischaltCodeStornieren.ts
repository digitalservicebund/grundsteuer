import { getFromErica, postToErica } from "~/erica/ericaClient";
import invariant from "tiny-invariant";
import {
  EricaError,
  EricaFreischaltcodeStornierenResponseData,
  EricaResponse,
  ericaUtils,
} from "~/erica/utils";
import { User, UserWithoutPdf } from "~/domain/user";

export const revokeFreischaltCode = async (elsterRequestId: string) => {
  const payload = { elsterRequestId };
  const result = await postToErica("v2/fsc/revocation", payload);
  if ("location" in result) {
    return { location: result.location.split("/").reverse()[0] };
  }
  return result;
};

export const revokeFscForUser = async (userData: User | UserWithoutPdf) => {
  invariant(userData.fscRequest, "expected an fscRequest in database for user");
  return revokeFreischaltCode(userData.fscRequest.requestId);
};

export const checkRevokeFreischaltCodeRequest = async (requestId: string) => {
  return getFromErica(`v2/fsc/revocation/${requestId}`);
};

export const isFscRevoked = (
  ericaResponse: EricaResponse
): EricaFreischaltcodeStornierenResponseData | EricaError => {
  const result = ericaUtils.extractResultFromEricaResponse(ericaResponse);
  if ("errorCode" in result && result.errorCode) {
    if (
      result.errorCode == "ELSTER_REQUEST_ID_UNKNOWN" ||
      result.errorCode == "ALREADY_REVOKED_UNLOCK_CODE"
    ) {
      return {
        errorType: "EricaUserInputError",
        errorMessage: result.errorMessage,
      };
    } else {
      console.warn(`Erica returned an error: ${result.errorMessage}`);
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
  return {
    transferticket: result.transferticket,
  };
};

export const checkFreischaltcodeRevocation = async (ericaRequestId: string) => {
  const ericaResponse = await checkRevokeFreischaltCodeRequest(ericaRequestId);
  if (ericaResponse && "errorType" in ericaResponse) {
    return ericaResponse;
  } else if (
    ericaResponse &&
    ericaUtils.isEricaRequestProcessed(ericaResponse)
  ) {
    return isFscRevoked(ericaResponse);
  }
};
