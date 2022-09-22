import { getAllEricaRequestIds } from "~/domain/user";
import {
  saveSuccessfulFscActivationData,
  saveSuccessfulFscRequestData,
  saveSuccessfulFscRevocationData,
} from "~/domain/lifecycleEvents.server";
import { checkFreischaltcodeActivation } from "~/erica/freischaltCodeAktivieren";
import { retrieveAntragsId } from "~/erica/freischaltCodeBeantragen";
import { checkFreischaltcodeRevocation } from "~/erica/freischaltCodeStornieren";
import { db } from "~/db.server";
import { ericaUtils } from "~/erica/utils";

export const updateOpenEricaRequests = async () => {
  console.log("Started updating FSC requests");
  let countOfProcessedEricaRequests = 0;
  let countOfProcessedEricaActivations = 0;
  let countOfProcessedEricaRevocations = 0;
  const startTime = Date.now();
  const usersWithOpenEricaRequests = await getAllEricaRequestIds();
  console.log("returned users:", JSON.stringify(usersWithOpenEricaRequests));

  for (const user of usersWithOpenEricaRequests) {
    if (user.ericaRequestIdFscBeantragen) {
      console.log("has erica id beantragen");
      const ericaResponse = await retrieveAntragsId(
        user.ericaRequestIdFscBeantragen
      );
      console.log("erica response: ", JSON.stringify(ericaResponse));
      if (ericaResponse && "elsterRequestId" in ericaResponse) {
        const clientIp = await ericaUtils.getClientIpForEricaRequest(
          user.ericaRequestIdFscBeantragen
        );
        console.log("client IP", clientIp);
        if (clientIp) {
          await saveSuccessfulFscRequestData(
            user.email,
            user.ericaRequestIdFscBeantragen,
            clientIp,
            ericaResponse.elsterRequestId,
            ericaResponse.transferticket,
            ericaResponse.taxIdNumber
          );
          countOfProcessedEricaRequests += 1;
        }
      }
      if (
        ericaResponse &&
        "errorType" in ericaResponse &&
        ericaResponse.errorType == "EricaRequestNotFound"
      ) {
        await removeEricaRequestIdFscBeantragen(
          user.id,
          user.ericaRequestIdFscBeantragen
        );
      }
    }
    if (user.ericaRequestIdFscAktivieren) {
      const ericaResponse = await checkFreischaltcodeActivation(
        user.ericaRequestIdFscAktivieren
      );
      if (ericaResponse && "transferticket" in ericaResponse) {
        const clientIp = await ericaUtils.getClientIpForEricaRequest(
          user.ericaRequestIdFscAktivieren
        );
        if (clientIp) {
          await saveSuccessfulFscActivationData(
            user.email,
            user.ericaRequestIdFscAktivieren,
            clientIp,
            ericaResponse.transferticket
          );
          countOfProcessedEricaActivations += 1;
        }
      }
      if (
        ericaResponse &&
        "errorType" in ericaResponse &&
        ericaResponse.errorType == "EricaRequestNotFound"
      ) {
        await removeEricaRequestIdFscAktivieren(
          user.id,
          user.ericaRequestIdFscAktivieren
        );
      }
    }
    if (user.ericaRequestIdFscStornieren) {
      const ericaResponse = await checkFreischaltcodeRevocation(
        user.ericaRequestIdFscStornieren
      );
      if (ericaResponse && "transferticket" in ericaResponse) {
        const clientIp = await ericaUtils.getClientIpForEricaRequest(
          user.ericaRequestIdFscStornieren
        );
        if (clientIp) {
          await saveSuccessfulFscRevocationData(
            user.email,
            user.ericaRequestIdFscStornieren,
            clientIp,
            ericaResponse.transferticket
          );
          countOfProcessedEricaRevocations += 1;
        }
      }
      if (
        ericaResponse &&
        "errorType" in ericaResponse &&
        ericaResponse.errorType == "EricaRequestNotFound"
      ) {
        await removeEricaRequestIdFscStornieren(
          user.id,
          user.ericaRequestIdFscStornieren
        );
      }
    }
  }
  const elapsedSeconds = (Date.now() - startTime) / 1000;
  console.log(
    `Finished updating open erica requests: elapsedSeconds: ${elapsedSeconds}, countOfProcessedEricaRequests: ${countOfProcessedEricaRequests}, countOfProcessedEricaActivations: ${countOfProcessedEricaActivations}, countOfProcessedEricaRevocations: ${countOfProcessedEricaRevocations}`
  );
};

const removeEricaRequestIdFscBeantragen = (
  userId: string,
  ericaRequestId: string
) => {
  return db.user.updateMany({
    where: {
      id: userId,
      ericaRequestIdFscBeantragen: ericaRequestId,
    },
    data: { ericaRequestIdFscBeantragen: null },
  });
};

const removeEricaRequestIdFscAktivieren = (
  userId: string,
  ericaRequestId: string
) => {
  return db.user.updateMany({
    where: {
      id: userId,
      ericaRequestIdFscAktivieren: ericaRequestId,
    },
    data: { ericaRequestIdFscAktivieren: null },
  });
};

const removeEricaRequestIdFscStornieren = (
  userId: string,
  ericaRequestId: string
) => {
  return db.user.updateMany({
    where: {
      id: userId,
      ericaRequestIdFscStornieren: ericaRequestId,
    },
    data: { ericaRequestIdFscStornieren: null },
  });
};
