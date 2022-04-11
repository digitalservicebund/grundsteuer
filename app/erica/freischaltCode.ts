import { postToErica } from "~/erica/ericaClient";
import { createDateStringForErica } from "~/erica/utils";

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

export { requestNewFreischaltCode };
