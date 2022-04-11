import { getFromErica, postToErica } from "~/erica/ericaClient";
import {
  createDateStringForErica,
  ericaResponseDto,
  extractResultFromEricaResponse,
} from "~/erica/utils";
import invariant from "tiny-invariant";

const createPayloadForNewFreischaltCode = (
  taxIdNumber: string,
  dateOfBirth: string
) => {
  return {
    taxIdNumber: taxIdNumber,
    dateOfBirth: createDateStringForErica(dateOfBirth),
  };
};

const requestNewFreischaltCode = async (
  taxIdNumber: string,
  dateOfBirth: string
) => {
  const payload = createPayloadForNewFreischaltCode(taxIdNumber, dateOfBirth);
  const result = await postToErica("v2/fsc/request", payload);
  return result?.split("/").reverse()[0];
};

const checkNewFreischaltCodeRequest = async (requestId: string) => {
  return getFromErica(`v2/fsc/request/${requestId}`);
};

const extractAntragsId = (requestData: ericaResponseDto): string => {
  const result = extractResultFromEricaResponse(requestData);
  invariant(
    "elsterRequestId" in result,
    "Extracted result from erica response has no ELSTER AntragsId"
  );
  return result.elsterRequestId;
};

export {
  requestNewFreischaltCode,
  checkNewFreischaltCodeRequest,
  extractAntragsId,
};
