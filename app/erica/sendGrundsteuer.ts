import { getFromErica, postToErica } from "~/erica/ericaClient";
import invariant from "tiny-invariant";
import { GrundModel } from "~/domain/steps";
import {
  EricaError,
  EricaResponse,
  EricaSendenResponseData,
  ericaUtils,
} from "~/erica/utils";

export const sendNewGrundsteuer = async (data: GrundModel) => {
  const result = await postToErica("v2/grundsteuer", data);
  if ("location" in result) {
    return { location: result.location.split("/").reverse()[0] };
  }
  return result;
};

const checkSentGrundsteuer = async (requestId: string) => {
  return getFromErica(`v2/grundsteuer/${requestId}`);
};

export const getSendenResult = async (
  ericaResponse: EricaResponse
): Promise<EricaError | EricaSendenResponseData> => {
  const result = ericaUtils.extractResultFromEricaResponse(ericaResponse);
  if ("errorCode" in result && result.errorCode) {
    console.info(
      `Received Erica error: ${result.errorCode} - ${
        result.errorMessage
      } - ${JSON.stringify(result.result?.validationErrors)}`
    );
    return {
      errorType: result.errorCode,
      errorMessage: result.errorMessage,
      validationErrors: result.result?.validationErrors,
    };
  }
  invariant(
    "transferticket" in result,
    "expected transferticket to be in erica result"
  );
  invariant("pdf" in result, "expected pdf to be in erica result");
  return {
    transferticket: result.transferticket,
    pdf: result.pdf,
  };
};

export const retrieveResult = async (ericaRequestId: string) => {
  const ericaResponse = await checkSentGrundsteuer(ericaRequestId);
  if (ericaResponse && "errorType" in ericaResponse) {
    return ericaResponse;
  } else if (
    ericaResponse &&
    ericaUtils.isEricaRequestProcessed(ericaResponse)
  ) {
    return getSendenResult(ericaResponse);
  }
};
