import cron from "node-cron";
import { db } from "~/db.server";

const scheduleFscCleanup = (cronExpression: string) => {
  console.info(
    "Schedule deleting expired FSC requests with cron expression: %s",
    cronExpression
  );
  cron.schedule(cronExpression, async () => deleteExpiredFscs());
};

const deleteExpiredFscs = async () => {
  const now = new Date();
  const oneYearAgo = new Date(now.setFullYear(now.getFullYear() - 1));
  const queryResult = await db.fscRequest.deleteMany({
    where: {
      createdAt: {
        lte: oneYearAgo,
      },
    },
  });
  console.log("Deleted %d expired FSC requests.", queryResult.count);
};

export const jobs = { scheduleFscCleanup };
