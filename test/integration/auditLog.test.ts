import { Buffer } from "buffer";
import fs from "fs";
import { AuditLog, AuditLogEvent, saveAuditLog } from "~/audit/auditLog";
import { decryptData } from "~/audit/crypto";
import { db } from "~/db.server";

const PRIVATE_KEY = Buffer.from(
  fs.readFileSync("test/resources/audit/private.pem", { encoding: "utf-8" })
);

describe("auditLog", () => {
  it("should encrypt audit log data correctly.", async () => {
    const data: AuditLog = {
      eventName: AuditLogEvent.FSC_BEANTRAGT,
      timestamp: Date.now(),
      ipAddress: "127.0.0.1",
      username: "foo@bar.com",
      eventData: {
        transferTicket: "foo",
        steuerId: "bar",
      },
    };

    await saveAuditLog(data);

    const savedLog = await db.auditLog.findFirst();

    expect(savedLog).toBeTruthy();
    const decryptedData = JSON.parse(decryptData(savedLog!.data, PRIVATE_KEY));
    expect(decryptedData).toEqual(data);
  });
});
