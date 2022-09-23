import { schedule } from "node-cron";
import { db } from "./db.server";
import { AuditLogEvent, encryptAuditLogData } from "~/audit/auditLog";
import { revokeFscForUser } from "~/erica/freischaltCodeStornieren";
import { deleteFscRequest } from "~/domain/user";
import { updateOpenEricaRequests } from "~/erica/updateOpenEricaRequests.server";
import * as remixNode from "@remix-run/node";

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
  try {
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
  } catch (error) {
    console.error(error);
  }
};

export const deleteExpiredPdfs = async () => {
  try {
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
  } catch (error) {
    console.error(error);
  }
};

export const deleteExpiredAccounts = async () => {
  try {
    const now = new Date();
    const fourMonthsAgo = new Date(now.setMonth(now.getMonth() - 4));
    const accountsToDelete = await db.user.findMany({
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
      include: {
        fscRequest: true,
      },
    });

    for (const account of accountsToDelete) {
      if (account.fscRequest) {
        await revokeFscForUser(account);
        await deleteFscRequest(account.email, account.fscRequest.requestId);
      }
    }
    const deleteAccounts = db.user.deleteMany({
      where: {
        email: {
          in: accountsToDelete.map((account) => account.email),
        },
      },
    });

    const logsToCreate = accountsToDelete.map((account) => {
      return {
        data: encryptAuditLogData({
          eventName: AuditLogEvent.ACCOUNT_DELETED,
          ipAddress: "cron",
          timestamp: Date.now(),
          username: account.email,
        }),
      };
    });

    const createAuditLogs = db.auditLog.createMany({
      data: logsToCreate,
    });

    const [resultDeletedAccounts] = await db.$transaction([
      deleteAccounts,
      createAuditLogs,
    ]);
    console.log(`Deleted ${resultDeletedAccounts.count} expired accounts`);
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

export const jobs = {
  scheduleFscCleanup,
  schedulePdfCleanup,
  scheduleAccountCleanup,
  scheduleUpdateEricaRequest,
};
