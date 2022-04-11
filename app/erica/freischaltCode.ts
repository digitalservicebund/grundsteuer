import { getFromErica, postToErica } from "~/erica/ericaClient";
import { ericaUtils, ericaResponseDto } from "~/erica/utils";
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

export const extractAntragsId = (requestData: ericaResponseDto): string => {
  const result = ericaUtils.extractResultFromEricaResponse(requestData);
  invariant(
    "elsterRequestId" in result,
    "Extracted result from erica response has no ELSTER AntragsId"
  );
  return result.elsterRequestId;
};
