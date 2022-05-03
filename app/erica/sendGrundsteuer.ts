import { getFromErica, postToErica } from "~/erica/ericaClient";
import invariant from "tiny-invariant";
import { GrundModel } from "~/domain/steps";
import { ericaUtils } from "~/erica/utils";

export const sendNewGrundsteuer = async (data: GrundModel) => {
  const result = await postToErica("v2/grundsteuer", data);
  invariant(result, "sendNewGrundsteuer did not return an ericaRequestId");
  return result.split("/").reverse()[0];
};

const checkSentGrundsteuer = async (requestId: string) => {
  return getFromErica(`v2/grundsteuer/${requestId}`);
};

export const retrieveResult = async (ericaRequestId: string) => {
  const ericaResponse = await checkSentGrundsteuer(ericaRequestId);
  if (ericaResponse && ericaUtils.isEricaRequestProcessed(ericaResponse)) {
    return ericaResponse;
  }
};
