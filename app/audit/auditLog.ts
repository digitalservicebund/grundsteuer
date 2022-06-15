import { db } from "~/db.server";
import { encryptData } from "~/audit/crypto";
import invariant from "tiny-invariant";

export enum AuditLogEvent {
  USER_REGISTERED = "user_registered",
  FSC_REQUESTED = "fsc_requested",
  FSC_ACTIVATED = "fsc_activated",
  FSC_REVOKED = "fsc_revoked",
  TAX_DECLARATION_SENT = "tax_declaration_submitted",
  CONFIRMED_COMPLETE_CORRECT = "confirmed_data_complete_correct",
  CONFIRMED_DATA_PRIVACY = "confirmed_data_privacy",
  CONFIRMED_TERMS_OF_USE = "confirmed_terms_of_use",
  CONFIRMED_DATA_PRIVACY_REGISTRATION = "confirmed_data_privacy_on_registration",
  CONFIRMED_TERMS_OF_USE_REGISTRATION = "confirmed_terms_of_use_on_registration",
  CONFIRMED_ELIGIBILE_TO_USE_REGISTRATION = "confirmed_eligibility_to_use_on_registration",
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

export interface TransferticketData {
  transferticket: string;
}

export interface ConfirmationData {
  value: string;
}

// implement specific types for each event
export type EventData =
  | FscBeantragtData
  | TransferticketData
  | ConfirmationData;

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
