import { Buffer } from "buffer";
import fs from "fs";
import { decryptData, hash } from "~/audit/crypto";
import { AuditLogData, encryptAuditLogData } from "~/audit/auditLog";
import * as readline from "readline";

export interface ReEncryptedLog {
  encryptedData: string;
  timestamp: string;
  user: string;
}

export async function reEncrypt(
  pathToKey: string,
  pathToInput: string,
  pathToOutput: string
) {
  console.log(pathToKey);
  const privateKey = Buffer.from(
    fs.readFileSync(pathToKey, { encoding: "utf-8" })
  );

  const fileStream = fs.createReadStream(pathToInput);

  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity,
  });
  const readableLogs: ReEncryptedLog[] = [];
  for await (const line of rl) {
    const decryptedLog = JSON.parse(
      decryptData(line, privateKey)
    ) as AuditLogData;
    readableLogs.push({
      timestamp: new Date(decryptedLog.timestamp).toISOString(),
      user: hash(decryptedLog.username),
      encryptedData: encryptAuditLogData(decryptedLog),
    });
  }

  fs.writeFileSync(pathToOutput, JSON.stringify(readableLogs, null, 2));
}
