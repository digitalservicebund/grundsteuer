import cron from "node-cron";
import { db } from "~/db.server";

const scheduleFscCleanup = (cronExpression: string) => {
  console.info(
    "Schedule deleting expired FSC requests with cron expression: %s",
    cronExpression
  );
  cron.schedule(cronExpression, async () => deleteExpiredFscs());
};

const schedulePdfCleanup = (cronExpression: string) => {
  console.info(
    "Schedule deleting expired PDFs with cron expression: %s",
    cronExpression
  );
  cron.schedule(cronExpression, async () => deleteExpiredPdfs());
};

export const deleteExpiredFscs = async () => {
  const now = new Date();
  const ninetyDaysAgo = new Date(now.setDate(now.getDate() - 90));
  const queryResult = await db.fscRequest.deleteMany({
    where: {
      createdAt: {
        lte: ninetyDaysAgo,
      },
    },
  });
  console.log("Deleted %d expired FSC requests.", queryResult.count);
};

export const deleteExpiredPdfs = async () => {
  const now = new Date();
  const oneHourAgo = new Date(now.setHours(now.getHours() - 1));
  const queryResult = await db.pdf.deleteMany({
    where: {
      createdAt: {
        lte: oneHourAgo,
      },
    },
  });
  console.log("Deleted %d expired PDFs.", queryResult.count);
};

export const jobs = { scheduleFscCleanup, schedulePdfCleanup };
