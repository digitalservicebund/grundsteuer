import { PrismaClient } from "@prisma/client";
import fs from "fs";

const EXPORT_FILENAME = "encrypted_logs";

async function exportAuditLogs(from: string, to: string) {
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
  fs.writeFileSync(EXPORT_FILENAME, "");
  auditLogs.forEach((log) =>
    fs.appendFileSync(EXPORT_FILENAME, log.data + "\n")
  );
}

function usage() {
  console.log("Usage: npm run audit:export from to");
  console.log("Example: npm run audit:export 2022-05-13 2022-05-14");
}

function main() {
  const args = process.argv.slice(2);
  if (args.length < 2) {
    usage();
  } else {
    exportAuditLogs(args[0], args[1]);
  }
}

main();
