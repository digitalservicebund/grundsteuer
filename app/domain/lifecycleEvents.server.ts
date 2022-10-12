import { db } from "~/db.server";
import { AuditLogEvent, saveAuditLog } from "~/audit/auditLog";
import {
  deleteFscRequest,
  findUserByEmail,
  setUserIdentified,
  User,
} from "~/domain/user";
import { revokeFscForUser } from "~/erica/freischaltCodeStornieren";

export const saveSuccessfulFscRequestData = async (
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

  const deleteEricaRequestIdFscBeantragen = () => {
    return db.user.updateMany({
      where: {
        id: user.id,
        ericaRequestIdFscBeantragen: ericaRequestIdFscBeantragen,
      },
      data: { ericaRequestIdFscBeantragen: null },
    });
  };

  const createNewFscRequest = async () => {
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
      const updatedUsersWithEricaId = await deleteEricaRequestIdFscBeantragen();

      if (updatedUsersWithEricaId.count != 1) {
        throw Error("ericaRequestId of user does not match");
      }

      await createNewFscRequest();
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
    if (shouldThrowError(error as object)) {
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

  const deleteEricaRequestIdFscAktivieren = () => {
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
      const updatedUsersWithEricaId = await deleteEricaRequestIdFscAktivieren();

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
    if (shouldThrowError(error as object)) {
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

  const deleteEricaRequestIdFscStornieren = () => {
    return db.user.updateMany({
      where: {
        id: user.id,
        ericaRequestIdFscStornieren,
      },
      data: { ericaRequestIdFscStornieren: null },
    });
  };

  const deleteFscRequest = () => {
    return db.fscRequest.deleteMany({
      where: {
        userId: user.id,
        requestId: user.fscRequest?.requestId,
      },
    });
  };

  try {
    await db.$transaction(async () => {
      const updatedUsersWithEricaId = await deleteEricaRequestIdFscStornieren();

      if (updatedUsersWithEricaId.count != 1) {
        throw Error("ericaRequestId of user does not match");
      }

      await deleteFscRequest();

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
    if (shouldThrowError(error as object)) {
      throw error;
    }
  }
};

const shouldThrowError = (error: object) => {
  return (
    !("message" in (error as object)) ||
    (error as { message: string }).message !==
      "ericaRequestId of user does not match"
  );
};

export const revokeOutstandingFSCRequests = async (user: User) => {
  if (user.fscRequest) {
    await revokeFscForUser(user);
    await deleteFscRequest(user.email, user.fscRequest.requestId);
  }
};
