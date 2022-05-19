import { db } from "~/db.server";
import { encryptData } from "~/audit/crypto";
import invariant from "tiny-invariant";

export enum AuditLogEvent {
  USER_REGISTERED = "user_registered",
  FSC_REQUESTED = "unlock_code_request_sent",
  FSC_ACTIVATED = "unlock_code_activation_sent",
  FSC_REVOCATED = "unlock_code_activation_sent",
  TAX_DECLARATION_SENT = "tax_declaration_submitted",
  CONFIRMED_COMPLETE_CORRECT = "confirmed_data_complete_correct",
  CONFIRMED_DATA_PRIVACY = "confirmed_data_privacy",
  CONFIRMED_TERMS_OF_USE = "confirmed_terms_of_use",
}

export interface AuditLogData {
  eventName: AuditLogEvent;
  timestamp: number;
  ipAddress: string;
  username: string;
  eventData?: EventData;
}

export interface FscBeantragtData {
  transferticket: string;
  steuerId: string;
}

export interface ConfirmationData {
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
