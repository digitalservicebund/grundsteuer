import { getFromErica, postToErica } from "~/erica/ericaClient";
import { ericaUtils, EricaResponse } from "~/erica/utils";
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
  return result?.split("/").reverse()[0];
};

export const checkNewFreischaltCodeRequest = async (requestId: string) => {
  return getFromErica(`v2/fsc/request/${requestId}`);
};

export const extractAntragsId = (ericaResponse: EricaResponse): string => {
  const result = ericaUtils.extractResultFromEricaResponse(ericaResponse);
  invariant(
    !("errorCode" in result),
    `Extracted result from erica response includes error {errorCode}`
  );
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
