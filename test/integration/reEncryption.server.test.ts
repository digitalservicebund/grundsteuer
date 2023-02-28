import { Buffer } from "buffer";
import fs from "fs";
import { AuditLogData, AuditLogEvent } from "~/audit/auditLog";
import { AuditLogScheme, decryptData, encryptData, hash } from "~/audit/crypto";
import * as readline from "readline";
import { reEncrypt, ReEncryptedLog } from "~/audit/reEncryption.server";

describe("reEncrypt", () => {
  it("should reEncrypt audit log data correctly.", async () => {
    const pathToEncryptedLogs = "test/resources/audit/encrypted_logs";
    const pathToReEncryptedLogs = "test/resources/audit/reencrypted_logs";
    const timestamp1 = new Date("2023-02-28T14:36:27.302Z");
    const timestamp2 = new Date("2023-02-29T16:28:27.302Z");
    const privateKey = Buffer.from(
      fs.readFileSync("test/resources/audit/private-v2.pem", {
        encoding: "utf-8",
      })
    );
    const username1 = "foo@bar.com";
    const username2 = "foo2@bar.com";
    const data1: AuditLogData = {
      eventName: AuditLogEvent.FSC_REQUESTED,
      timestamp: +timestamp1,
      ipAddress: "127.0.0.1",
      username: username1,
      eventData: {
        transferticket: "foo",
        steuerId: "bar",
      },
    };
    const data2: AuditLogData = {
      eventName: AuditLogEvent.FSC_REVOKED,
      timestamp: +timestamp2,
      ipAddress: "127.0.0.2",
      username: username2,
      eventData: {
        transferticket: "foo2",
      },
    };

    const encryptedData1 = encryptData(
      JSON.stringify(data1),
      AuditLogScheme.V1
    );
    const encryptedData2 = encryptData(
      JSON.stringify(data2),
      AuditLogScheme.V1
    );

    fs.writeFileSync(
      pathToEncryptedLogs,
      `${encryptedData1}\n${encryptedData2}`
    );

    reEncrypt(
      "test/resources/audit/private.pem",
      pathToEncryptedLogs,
      pathToReEncryptedLogs
    );

    const fileStream = fs.createReadStream(pathToReEncryptedLogs);
    const rl = readline.createInterface({
      input: fileStream,
      crlfDelay: Infinity,
    });
    let lines = "";
    for await (const line of rl) {
      lines += line;
    }
    console.log(lines);
    const reEncryptedData = JSON.parse(lines) as ReEncryptedLog[];

    expect(reEncryptedData[0].timestamp).toEqual(
      new Date(data1.timestamp).toISOString()
    );
    expect(reEncryptedData[0].user).toEqual(hash(data1.username));
    expect(
      JSON.parse(
        decryptData(reEncryptedData[0].encryptedData, privateKey)
      ) as AuditLogData
    ).toEqual(data1);

    expect(reEncryptedData[1].timestamp).toEqual(
      new Date(data2.timestamp).toISOString()
    );
    expect(reEncryptedData[1].user).toEqual(hash(data2.username));
    expect(
      JSON.parse(
        decryptData(reEncryptedData[1].encryptedData, privateKey)
      ) as AuditLogData
    ).toEqual(data2);
  });
});
