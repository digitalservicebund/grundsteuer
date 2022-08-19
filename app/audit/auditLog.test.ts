import { Buffer } from "buffer";
import fs from "fs";
import {
  AuditLogData,
  AuditLogEvent,
  encryptAuditLogData,
} from "~/audit/auditLog";
import { decryptData } from "~/audit/crypto";
import { db } from "~/db.server";

const PRIVATE_KEY = Buffer.from(
  fs.readFileSync("test/resources/audit/private.pem", { encoding: "utf-8" })
);

describe("auditLog", () => {
  afterAll(async () => {
    await db.auditLog.deleteMany({});
  });
  it("should encrypt audit log data correctly.", () => {
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

    const encryptedData = encryptAuditLogData(data);

    const decryptedData = JSON.parse(decryptData(encryptedData, PRIVATE_KEY));
    expect(decryptedData).toEqual(data);
  });
});
