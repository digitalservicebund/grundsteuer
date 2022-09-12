import { ActionFunction, json, LoaderFunction } from "@remix-run/node";
import invariant from "tiny-invariant";
import ipRangeCheck from "ip-range-check";
import { redis } from "~/redis.server";
import * as crypto from "crypto";

// outgoing webhook requests from Sendinblue will be sent from these ranges:
const SENDINBLUE_IP_RANGES = ["185.107.232.0/24", "1.179.112.0/20"];

// keep records for 24 hours
const TTL_IN_SECONDS = 24 * 60 * 60;

const redisKey = (hashedMessageId: string) => {
  invariant(hashedMessageId, "hashedMessageId undefined");
  return "message:" + hashedMessageId;
};

export const hashMessageId = (messageId: string) => {
  invariant(messageId, "messageId undefined");
  return crypto.createHash("sha1").update(messageId).digest("hex");
};

// see https://developers.sendinblue.com/docs/transactional-webhooks
interface SendinbluePayload {
  "message-id": string;
  email: string;
  event: string;
  reason?: string;
  ts_event: number;
}

export enum StatusEvent {
  SENT = "request",
  DEFERRED = "deferred",
  DELIVERED = "delivered",
  SOFT_BOUNCE = "soft_bounce",
  HARD_BOUNCE = "hard_bounce",
  BLOCKED = "blocked",
}

export interface EmailStatus {
  event: StatusEvent;
  email: string;
  reason?: string;
  timestamp: number;
}

export const getEmailStatus: (
  hashedMessageId: string
) => Promise<null | EmailStatus> = async (hashedMessageId: string) => {
  const record = await redis.get(redisKey(hashedMessageId));
  if (!record) {
    return null;
  }
  return JSON.parse(record) as EmailStatus;
};

// overwrite existing record if and only if:
// old status is request (equivalent to SENT), or
// old status is deferred and new status is not request
const hasPrecedence = (oldEvent: StatusEvent, newEvent: StatusEvent) => {
  if (oldEvent === StatusEvent.SENT) return true;
  return oldEvent === StatusEvent.DEFERRED && newEvent !== StatusEvent.SENT;
};

const assertValidEvent = (payload: SendinbluePayload) => {
  if (
    !Object.values(StatusEvent).some((event: string) => event === payload.event)
  ) {
    throw new Error(`Unknown Sendinblue event: ${payload.event}`);
  }
};

const update = async (payload: SendinbluePayload) => {
  assertValidEvent(payload);

  const data: EmailStatus = {
    event: payload.event as StatusEvent,
    email: payload.email,
    reason: payload.reason,
    timestamp: payload.ts_event,
  };

  const messageId = payload["message-id"];

  const hashedMessageId = hashMessageId(messageId);
  const existingRecord: EmailStatus | null = await getEmailStatus(
    hashedMessageId
  );

  if (!existingRecord || hasPrecedence(existingRecord.event, data.event)) {
    await redis.set(
      redisKey(hashedMessageId),
      JSON.stringify(data),
      TTL_IN_SECONDS
    );
  }
};

export const loader: LoaderFunction = () => {
  return json({ message: "Method not allowed" }, 405);
};

export const action: ActionFunction = async ({ request, context }) => {
  if (request.method !== "POST") {
    return json({ message: "Method not allowed" }, 405);
  }

  if (process.env.APP_ENV === "production") {
    const { clientIp } = context;
    invariant(clientIp, "Missing clientIp");

    if (!ipRangeCheck(clientIp, SENDINBLUE_IP_RANGES)) {
      return json({ message: "Forbidden" }, 403);
    }
  }

  const payload = await request.json();
  await update(payload);

  return json({ success: true }, 200);
};
