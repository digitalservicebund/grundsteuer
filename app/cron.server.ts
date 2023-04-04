import { schedule } from "node-cron";
import { db } from "./db.server";
import { deleteManyUsers } from "~/domain/user";
import { updateOpenEricaRequests } from "~/erica/updateOpenEricaRequests.server";
import * as remixNode from "@remix-run/node";

const schedulePdfCleanup = (cronExpression: string) => {
  console.info(
    "Schedule deleting expired PDFs with cron expression: %s",
    cronExpression
  );
  schedule(cronExpression, async () => deleteExpiredPdfs());
};

const scheduleTransferticketCleanup = (cronExpression: string) => {
  console.info(
    "Schedule deleting expired transfertickets with cron expression: %s",
    cronExpression
  );
  schedule(cronExpression, async () => deleteExpiredTransfertickets());
};

const scheduleAccountCleanup = (cronExpression: string) => {
  console.info(
    "Schedule deleting expired accounts with cron expression: %s",
    cronExpression
  );
  schedule(cronExpression, async () => deleteExpiredAccounts());
};

export const deleteExpiredPdfs = async () => {
  try {
    const now = new Date();
    const oneDayAgo = new Date(now.setUTCDate(now.getUTCDate() - 1));
    const queryResult = await db.pdf.deleteMany({
      where: {
        createdAt: {
          lte: oneDayAgo,
        },
      },
    });
    console.log("Deleted %d expired PDFs.", queryResult.count);
  } catch (error) {
    console.error(error);
  }
};

export const deleteExpiredTransfertickets = async () => {
  try {
    const now = new Date();
    const oneDayAgo = new Date(now.setUTCDate(now.getUTCDate() - 1));
    const queryResult = await db.user.updateMany({
      where: {
        NOT: { transferticket: null },
        lastDeclarationAt: {
          lte: oneDayAgo,
        },
      },
      data: { transferticket: null },
    });
    console.log("Deleted %d expired transfertickets.", queryResult.count);
  } catch (error) {
    console.error(error);
  }
};

export const deleteExpiredAccounts = async () => {
  try {
    const now = new Date();
    const sevenMonthsAgo = new Date(now.setMonth(now.getMonth() - 7));
    const accounts = await db.user.findMany({
      where: {
        OR: [
          // Declaration sent
          {
            lastDeclarationAt: {
              lte: sevenMonthsAgo,
            },
          },
          // identified
          {
            identifiedAt: {
              lte: sevenMonthsAgo,
            },
            lastDeclarationAt: null,
          },
          // simple account
          {
            createdAt: {
              lte: sevenMonthsAgo,
            },
            identifiedAt: null,
            lastDeclarationAt: null,
          },
        ],
      },
      include: {
        fscRequest: true,
      },
    });

    const accountsToDelete = accounts.filter((account) => {
      return (
        !account.fscRequest || account.fscRequest.createdAt < sevenMonthsAgo
      );
    });

    const count = await deleteManyUsers(accountsToDelete);
    console.log(`Deleted ${count} expired accounts`);
  } catch (error) {
    console.error(error);
  }
};

const scheduleUpdateEricaRequest = (cronExpression: string) => {
  console.info("Schedule updating open erica requests", cronExpression);
  schedule(cronExpression, async () => {
    try {
      remixNode.installGlobals();
      await updateOpenEricaRequests();
    } catch (e) {
      console.error("Failed to update erica requests", e);
    }
  });
};

export const deleteOutdatedSurveyResults = async () => {
  try {
    const now = new Date();
    const oneDayAgo = new Date(now.setUTCDate(now.getUTCDate() - 1));
    const queryResult = await db.survey.deleteMany({
      where: {
        createdAt: {
          lte: oneDayAgo,
        },
      },
    });
    console.log("Deleted %d outdated survey results.", queryResult.count);
  } catch (error) {
    console.error(error);
  }
};

const scheduleSurveyCleanUp = (cronExpression: string) => {
  console.info(
    "Schedule deleting outdated survey entries with cron expression: %s",
    cronExpression
  );
  schedule(cronExpression, async () => deleteOutdatedSurveyResults());
};

export const jobs = {
  schedulePdfCleanup,
  scheduleTransferticketCleanup,
  scheduleAccountCleanup,
  scheduleUpdateEricaRequest,
  scheduleSurveyCleanUp,
};
