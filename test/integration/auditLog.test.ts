import { Buffer } from "buffer";
import fs from "fs";
import { AuditLogData, AuditLogEvent, saveAuditLog } from "~/audit/auditLog";
import { decryptData } from "~/audit/crypto";
import { db } from "~/db.server";
import { AuditLogV2 } from "@prisma/client";

export const PRIVATE_KEY = Buffer.from(
  fs.readFileSync("test/resources/audit/private.pem", { encoding: "utf-8" })
);

describe("auditLog", () => {
  afterEach(async () => {
    await db.auditLogV2.deleteMany({});
  });

  it("should encrypt audit log data correctly.", async () => {
    const data: AuditLogData = {
      eventName: AuditLogEvent.FSC_REQUESTED,
      timestamp: Date.now(),
      ipAddress: "127.0.0.1",
      username: "foo@bar.com",
      eventData: {
        transferticket: "foo",
        steuerId: "bar",
      },
    };

    await saveAuditLog(data);

    const savedLog = (await db.auditLogV2.findFirst()) as AuditLogV2;

    expect(savedLog).toBeTruthy();
    const decryptedData = JSON.parse(decryptData(savedLog.data, PRIVATE_KEY));
    expect(decryptedData).toEqual(data);
  });
});
