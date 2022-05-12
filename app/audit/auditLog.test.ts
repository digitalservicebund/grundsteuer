import { Buffer } from "buffer";
import fs from "fs";
import { AuditLog, AuditLogEvent, encryptAuditLogData } from "~/audit/auditLog";
import { decryptData } from "~/audit/crypto";

const PRIVATE_KEY = Buffer.from(
  fs.readFileSync("test/resources/audit/private.pem", { encoding: "utf-8" })
);

describe("auditLog", () => {
  it("should encrypt audit log data correctly.", () => {
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

    const encryptedData = encryptAuditLogData(data);

    const decryptedData = JSON.parse(decryptData(encryptedData, PRIVATE_KEY));
    expect(decryptedData).toEqual(data);
  });
});
