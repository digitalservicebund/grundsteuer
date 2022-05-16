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

async function decryptLogs(
  pathToKey: string,
  pathToInput: string,
  username: "all" | string
) {
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
    if (username === "all" || username === decryptedLog.username)
      readableLogs.push({
        ...decryptedLog,
        timestamp: new Date(decryptedLog.timestamp).toISOString(),
      });
  }

  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(readableLogs, null, 2));
}

function usage() {
  console.log(
    "Usage: npm run audit:decrypt path-to-private-key path-to-encrypted-logs [username]"
  );
  console.log(
    "Example: npm run audit:decrypt /path/to/key.pem /another/path/to/encrypted-logs user@example.com"
  );
}

function main() {
  const args = process.argv.slice(2);
  if (args.length < 2) {
    usage();
  } else {
    decryptLogs(args[0], args[1], args[2] || "all");
  }
}

main();
