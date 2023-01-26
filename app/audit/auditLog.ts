import { db } from "~/db.server";
import { AuditLogScheme, encryptData, hash } from "~/audit/crypto";

const SCHEME = AuditLogScheme.V2;

export enum AuditLogEvent {
  USER_REGISTERED = "user_registered",
  FSC_REQUESTED = "fsc_requested",
  FSC_ACTIVATED = "fsc_activated",
  FSC_REVOKED = "fsc_revoked",
  IDENTIFIED_VIA_EKONA = "identified_via_ekona",
  IDENTIFIED_VIA_BUNDES_IDENT = "identified_via_bundes_ident",
  TAX_DECLARATION_SENT = "tax_declaration_submitted",
  CONFIRMED_COMPLETE_CORRECT = "confirmed_data_complete_correct",
  CONFIRMED_DATA_PRIVACY = "confirmed_data_privacy",
  CONFIRMED_TERMS_OF_USE = "confirmed_terms_of_use",
  CONFIRMED_DATA_PRIVACY_REGISTRATION = "confirmed_data_privacy_on_registration",
  CONFIRMED_TERMS_OF_USE_REGISTRATION = "confirmed_terms_of_use_on_registration",
  CONFIRMED_ELIGIBLE_TO_USE_REGISTRATION = "confirmed_eligibility_to_use_on_registration",
  ACCOUNT_DELETED = "account_deleted",
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

export interface EkonaIdentifiedData {
  idnr: string;
  firstName?: string;
  lastName: string;
  street: string;
  housenumber: string;
  postalCode?: string;
  addressSupplement?: string;
  city: string;
  country: string;
}

export interface BundesIdentIdentifiedData {
  firstName: string;
  lastName: string;
  street: string;
  postalCode: string;
  city: string;
  country: string;
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
  | ConfirmationData
  | EkonaIdentifiedData
  | BundesIdentIdentifiedData;

export const saveAuditLog = async (data: AuditLogData) => {
  await db.auditLogV2.create({
    data: {
      user: hash(data.username),
      version: SCHEME.version,
      data: encryptAuditLogData(data),
    },
  });
};

export const encryptAuditLogData = (data: AuditLogData) => {
  return encryptData(JSON.stringify(data), SCHEME);
};
