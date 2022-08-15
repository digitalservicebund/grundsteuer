import { schedule } from "node-cron";
import { db } from "./db.server";

const scheduleFscCleanup = (cronExpression: string) => {
  console.info(
    "Schedule deleting expired FSC requests with cron expression: %s",
    cronExpression
  );
  schedule(cronExpression, async () => deleteExpiredFscs());
};

const schedulePdfCleanup = (cronExpression: string) => {
  console.info(
    "Schedule deleting expired PDFs with cron expression: %s",
    cronExpression
  );
  schedule(cronExpression, async () => deleteExpiredPdfs());
};

const scheduleAccountCleanup = (cronExpression: string) => {
  console.info(
    "Schedule deleting expired accounts with cron expression: %s",
    cronExpression
  );
  schedule(cronExpression, async () => deleteExpiredAccounts());
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

export const deleteExpiredAccounts = async () => {
  const now = new Date();
  const fourMonthsAgo = new Date(now.setMonth(now.getMonth() - 4));
  const queryResult = await db.user.deleteMany({
    where: {
      OR: [
        // Declaration sent
        {
          lastDeclarationAt: {
            lte: fourMonthsAgo,
          },
        },
        // identified
        {
          identifiedAt: {
            lte: fourMonthsAgo,
          },
          lastDeclarationAt: null,
        },
        // simple account
        {
          createdAt: {
            lte: fourMonthsAgo,
          },
          identifiedAt: null,
          lastDeclarationAt: null,
        },
      ],
    },
  });
  console.log("Deleted %d expired Accounts.", queryResult.count);
};

export const jobs = {
  scheduleFscCleanup,
  schedulePdfCleanup,
  scheduleAccountCleanup,
};
