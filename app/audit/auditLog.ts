import { db } from "~/db.server";
import { encryptData } from "~/audit/crypto";
import invariant from "tiny-invariant";

export enum AuditLogEvent {
  FSC_BEANTRAGT = "unlock_code_request_sent",
}

export interface AuditLogData {
  eventName: AuditLogEvent;
  timestamp: number;
  ipAddress: string;
  username: string;
  eventData: EventData;
}

export interface FscBeantragtData {
  transferTicket: string;
  steuerId: string;
}

export interface ConfirmationData {
  label: string;
  value: string;
}

// implement specific types for each event
export type EventData = FscBeantragtData | ConfirmationData;

export const saveAuditLog = async (data: AuditLogData) => {
  await db.auditLog.create({
    data: {
      data: encryptAuditLogData(data),
    },
  });
};

export const encryptAuditLogData = (data: AuditLogData) => {
  invariant(
    process.env.AUDIT_PUBLIC_KEY,
    "Environemnt variable AUDIT_PUBLIC_KEY is not set."
  );
  const publicKey = Buffer.from(process.env.AUDIT_PUBLIC_KEY);
  return encryptData(JSON.stringify(data), publicKey);
};
