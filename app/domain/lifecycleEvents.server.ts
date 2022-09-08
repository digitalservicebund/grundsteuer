import {db} from "~/db.server";
import {AuditLogEvent, encryptAuditLogData} from "~/audit/auditLog";
import {findUserByEmail} from "~/domain/user";

export const saveSuccessfullFscRequestData = async (email: string, ericaRequestIdFscBeantragen: string, clientIp: string, requestId: string, transferticket: string, steuerId: string) => {
  const user = await findUserByEmail(email);
  if (!user) {
    throw new Error("User not found.");
  }

  const _deleteEricaRequestIdFscBeantragen = db.user.updateMany({
    where: {
      id: user.id,
      ericaRequestIdFscBeantragen: ericaRequestIdFscBeantragen
    },
    data: {ericaRequestIdFscBeantragen: null},
  });
  const _deleteFscRequest = db.fscRequest.deleteMany({
    where: {
      userId: user.id,
    },
  });
  const _saveFscRequest = db.fscRequest.create({
    data: {
      requestId,
      User: {connect: {email: user.email}},
    },
  });
  const auditLogData = {
    eventName: AuditLogEvent.FSC_REQUESTED,
    timestamp: Date.now(),
    ipAddress: clientIp,
    username: user.email,
    eventData: {
      transferticket,
      steuerId,
    },
  }
  const _saveAuditLog = db.auditLog.create({
    data: {
      data: encryptAuditLogData(auditLogData),
    },
  });
  await db.$transaction([
      _deleteEricaRequestIdFscBeantragen,
      _deleteFscRequest,
      _saveFscRequest,
      _saveAuditLog,
    ]);
}