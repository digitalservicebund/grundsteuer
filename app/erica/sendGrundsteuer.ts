import { getFromErica, postToErica } from "~/erica/ericaClient";
import invariant from "tiny-invariant";
import { GrundModel } from "~/domain/steps";
import { EricaResponse, ericaUtils } from "~/erica/utils";

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

export const getPositiveResult = async (ericaResponse: EricaResponse) => {
  invariant(
    ericaResponse.processStatus === "Success",
    "only call for success status"
  );
  invariant(
    ericaResponse.result,
    "expected result to be present in erica success response"
  );
  invariant(
    "transfer_ticket" in ericaResponse.result,
    "expected transferticket to be in erica result"
  );
  invariant(
    "pdf" in ericaResponse.result,
    "expected transferticket to be in erica result"
  );

  return {
    transferticket: ericaResponse.result.transfer_ticket,
    pdf: Buffer.from(ericaResponse.result.pdf),
  };
};
