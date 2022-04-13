import cron from "node-cron";
import { db } from "~/db.server";

const scheduleFscCleanup = (cronExpression: string) => {
  console.info(
    "Schedule deleting expired FSC requests with cron expression: %s",
    cronExpression
  );
  cron.schedule(cronExpression, async () => deleteExpiredFscs());
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

export const jobs = { scheduleFscCleanup };
