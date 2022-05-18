import { Buffer } from "buffer";
import fs from "fs";
import { AuditLogData, AuditLogEvent, saveAuditLog } from "~/audit/auditLog";
import { decryptData } from "~/audit/crypto";
import { db } from "~/db.server";
import { AuditLog } from "@prisma/client";

const PRIVATE_KEY = Buffer.from(
  fs.readFileSync("test/resources/audit/private.pem", { encoding: "utf-8" })
);

describe("auditLog", () => {
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

    const savedLog = (await db.auditLog.findFirst()) as AuditLog;

    expect(savedLog).toBeTruthy();
    const decryptedData = JSON.parse(decryptData(savedLog.data, PRIVATE_KEY));
    expect(decryptedData).toEqual(data);
  });
});
