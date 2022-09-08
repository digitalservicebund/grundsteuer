import { db } from "~/db.server";
import { AuditLogEvent, saveAuditLog } from "~/audit/auditLog";
import { findUserByEmail, setUserIdentified } from "~/domain/user";

export const saveSuccessfullFscRequestData = async (
  email: string,
  ericaRequestIdFscBeantragen: string,
  clientIp: string,
  requestId: string,
  transferticket: string,
  steuerId: string
) => {
  const user = await findUserByEmail(email);
  if (!user) {
    throw new Error("User not found.");
  }

  const _deleteEricaRequestIdFscBeantragen = () => {
    return db.user.updateMany({
      where: {
        id: user.id,
        ericaRequestIdFscBeantragen: ericaRequestIdFscBeantragen,
      },
      data: { ericaRequestIdFscBeantragen: null },
    });
  };

  const _createNewFscRequest = async () => {
    await db.fscRequest.deleteMany({
      where: {
        userId: user.id,
      },
    });
    await db.fscRequest.create({
      data: {
        requestId,
        User: { connect: { email: user.email } },
      },
    });
  };

  try {
    await db.$transaction(async () => {
      const updatedUsersWithEricaId =
        await _deleteEricaRequestIdFscBeantragen();

      if (updatedUsersWithEricaId.count != 1) {
        throw Error("ericaRequestId of user does not match");
      }

      await _createNewFscRequest();
      await saveAuditLog({
        eventName: AuditLogEvent.FSC_REQUESTED,
        timestamp: Date.now(),
        ipAddress: clientIp,
        username: user.email,
        eventData: {
          transferticket,
          steuerId,
        },
      });
    });
  } catch (error) {
    if (
      !("message" in (error as object)) ||
      (error as { message: string }).message !==
        "ericaRequestId of user does not match"
    ) {
      throw error;
    }
  }
};

export const saveSuccessfulFscActivationData = async (
  email: string,
  ericaRequestIdFscAktivieren: string,
  clientIp: string,
  transferticket: string
) => {
  const user = await findUserByEmail(email);
  if (!user) {
    throw new Error("User not found.");
  }

  const _deleteEricaRequestIdFscAktivieren = () => {
    return db.user.updateMany({
      where: {
        id: user.id,
        ericaRequestIdFscAktivieren,
      },
      data: { ericaRequestIdFscAktivieren: null },
    });
  };

  try {
    await db.$transaction(async () => {
      const updatedUsersWithEricaId =
        await _deleteEricaRequestIdFscAktivieren();

      if (updatedUsersWithEricaId.count != 1) {
        throw Error("ericaRequestId of user does not match");
      }

      await setUserIdentified(email);
      await saveAuditLog({
        eventName: AuditLogEvent.FSC_ACTIVATED,
        timestamp: Date.now(),
        ipAddress: clientIp,
        username: email,
        eventData: {
          transferticket: transferticket,
        },
      });
    });
  } catch (error) {
    if (
      !("message" in (error as object)) ||
      (error as { message: string }).message !==
        "ericaRequestId of user does not match"
    ) {
      throw error;
    }
  }
};

export const saveSuccessfulFscRevocationData = async (
  email: string,
  ericaRequestIdFscStornieren: string,
  clientIp: string,
  transferticket: string
) => {
  const user = await findUserByEmail(email);
  if (!user) {
    throw new Error("User not found.");
  }

  const _deleteEricaRequestIdFscStornieren = () => {
    return db.user.updateMany({
      where: {
        id: user.id,
        ericaRequestIdFscStornieren,
      },
      data: { ericaRequestIdFscStornieren: null },
    });
  };

  try {
    await db.$transaction(async () => {
      const updatedUsersWithEricaId =
        await _deleteEricaRequestIdFscStornieren();

      if (updatedUsersWithEricaId.count != 1) {
        throw Error("ericaRequestId of user does not match");
      }

      await saveAuditLog({
        eventName: AuditLogEvent.FSC_REVOKED,
        timestamp: Date.now(),
        ipAddress: clientIp,
        username: email,
        eventData: {
          transferticket: transferticket,
        },
      });
    });
  } catch (error) {
    if (
      !("message" in (error as object)) ||
      (error as { message: string }).message !==
        "ericaRequestId of user does not match"
    ) {
      throw error;
    }
  }
};
