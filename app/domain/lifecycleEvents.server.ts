import { db } from "~/db.server";
import { AuditLogEvent, saveAuditLog } from "~/audit/auditLog";
import { findUserByEmail } from "~/domain/user";

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
