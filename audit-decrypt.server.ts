import { Buffer } from "buffer";
import fs from "fs";
import { decryptData } from "~/audit/crypto";
import { AuditLogData, AuditLogEvent, EventData } from "~/audit/auditLog";
import * as readline from "readline";

const OUTPUT_FILE = "decrypted_logs.json";

interface ReadableLog {
  eventName: AuditLogEvent;
  timestamp: string;
  ipAddress: string;
  username: string;
  eventData?: EventData;
}

async function decryptLogs(pathToKey: string, pathToInput: string) {
  const privateKey = Buffer.from(
    fs.readFileSync(pathToKey, { encoding: "utf-8" })
  );

  const fileStream = fs.createReadStream(pathToInput);

  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity,
  });

  const readableLogs: ReadableLog[] = [];
  for await (const line of rl) {
    const decryptedLog = JSON.parse(
      decryptData(line, privateKey)
    ) as AuditLogData;
    readableLogs.push({
      ...decryptedLog,
      timestamp: new Date(decryptedLog.timestamp).toISOString(),
    });
  }

  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(readableLogs));
}

function usage() {
  console.log(
    "Usage: npm run audit:decrypt /path/to/key.pem /another/path/to/encrypted-logs"
  );
}

function main() {
  const args = process.argv.slice(2);
  if (args.length < 2) {
    usage();
  } else {
    decryptLogs(args[0], args[1]);
  }
}

main();
