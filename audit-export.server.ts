import { PrismaClient } from "@prisma/client";
import fs from "fs";

async function exportAuditLogsFromAuditLogV1(
  from: string,
  to: string,
  pathToFile: string
) {
  console.log(`Exporting audit logs from ${from} to ${to}`);
  const db = new PrismaClient();
  const auditLogs = await db.auditLog.findMany({
    where: {
      createdAt: {
        gte: new Date(from),
        lte: new Date(to),
      },
    },
  });
  fs.writeFileSync(pathToFile, "");
  auditLogs.forEach((log) => fs.appendFileSync(pathToFile, log.data + "\n"));
}

async function exportAuditLogs(from: string, to: string, pathToFile: string) {
  console.log(`Exporting audit logs from ${from} to ${to}`);
  const db = new PrismaClient();
  const auditLogs = await db.auditLogV2.findMany({
    where: {
      createdAt: {
        gte: new Date(from),
        lte: new Date(to),
      },
    },
  });
  fs.writeFileSync(pathToFile, "");
  auditLogs.forEach((log) => fs.appendFileSync(pathToFile, log.data + "\n"));
}

function usage() {
  console.log("Usage: npm run audit:export from to path-to-file");
  console.log(
    "Example: npm run audit:export 2022-05-13 2022-05-14 /tpm/encrypted_logs"
  );
  console.log(
    "For V2: npm run audit:export 2022-05-13 2022-05-14 /tpm/encrypted_logs v2"
  );
}

function main() {
  const args = process.argv.slice(2);
  if (args.length < 3) {
    usage();
  } else if (args.length == 4 && args[3] == "v2") {
    exportAuditLogs(args[0], args[1], args[2]);
  } else {
    exportAuditLogsFromAuditLogV1(args[0], args[1], args[2]);
  }
}

main();
