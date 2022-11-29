import { db } from "~/db.server";
import { Prisma } from "@prisma/client";
import invariant from "tiny-invariant";
import { revokeFscForUser } from "~/erica/freischaltCodeStornieren";
import { AuditLogEvent, encryptAuditLogData } from "~/audit/auditLog";

const normalizeEmail = (email: string) => email.trim().toLowerCase();

export type User = Prisma.UserGetPayload<{
  include: { fscRequest: true; pdf: true };
}>;
export type UserWithoutPdf = Prisma.UserGetPayload<{
  include: { fscRequest: true };
}>;

export const createUser = async (email: string) => {
  const normalizedEmail = normalizeEmail(email);
  return db.user.create({
    data: {
      email: normalizedEmail,
    },
  });
};

export const userExists = async (email: string) => {
  const user = await db.user.findFirst({
    where: { email: normalizeEmail(email) },
  });
  return !!user;
};

export const findUserByEmail = async (email: string): Promise<User | null> => {
  const normalizedEmail = normalizeEmail(email);
  return db.user.findUnique({
    where: {
      email: normalizedEmail,
    },
    include: {
      fscRequest: true,
      pdf: true,
    },
  });
};

export const findUserById = async (userId: string): Promise<User | null> => {
  return db.user.findUnique({
    where: {
      id: userId,
    },
    include: {
      fscRequest: true,
      pdf: true,
    },
  });
};

export const saveFscRequest = async (
  email: string,
  requestId: string,
  createdAt: Date = new Date()
) => {
  const user = await findUserByEmail(email);
  if (!user) {
    throw new Error("User not found.");
  }

  await db.fscRequest.create({
    data: {
      requestId: requestId,
      createdAt: createdAt,
      User: { connect: { email: user.email } },
    },
  });
};

export const deleteFscRequest = async (
  email: string,
  requestIdToDelete?: string
) => {
  const user = await findUserByEmail(email);
  if (!user) {
    throw new Error("User not found.");
  }
  if (requestIdToDelete) {
    await db.fscRequest.deleteMany({
      where: {
        userId: user.id,
        requestId: requestIdToDelete,
      },
    });
  } else {
    await db.fscRequest.deleteMany({
      where: {
        userId: user.id,
      },
    });
  }
};

export const saveEricaRequestIdFscBeantragen = async (
  email: string,
  ericaRequestId: string
) => {
  return db.user.update({
    where: { email: normalizeEmail(email) },
    data: { ericaRequestIdFscBeantragen: ericaRequestId },
  });
};

export const deleteEricaRequestIdFscBeantragen = async (email: string) => {
  return db.user.update({
    where: { email: normalizeEmail(email) },
    data: { ericaRequestIdFscBeantragen: null },
  });
};

export const saveEricaRequestIdFscAktivieren = async (
  email: string,
  ericaRequestId: string
) => {
  return db.user.update({
    where: { email: normalizeEmail(email) },
    data: { ericaRequestIdFscAktivieren: ericaRequestId },
  });
};

export const deleteEricaRequestIdFscAktivieren = async (email: string) => {
  return db.user.update({
    where: { email: normalizeEmail(email) },
    data: { ericaRequestIdFscAktivieren: null },
  });
};

export const saveEricaRequestIdFscStornieren = async (
  email: string,
  ericaRequestId: string
) => {
  return db.user.update({
    where: { email: normalizeEmail(email) },
    data: { ericaRequestIdFscStornieren: ericaRequestId },
  });
};

export const deleteEricaRequestIdFscStornieren = async (email: string) => {
  return db.user.update({
    where: { email: normalizeEmail(email) },
    data: { ericaRequestIdFscStornieren: null },
  });
};

export const saveEricaRequestIdSenden = async (
  email: string,
  ericaRequestId: string
) => {
  return db.user.update({
    where: { email: normalizeEmail(email) },
    data: { ericaRequestIdSenden: ericaRequestId },
  });
};

export const deleteEricaRequestIdSenden = async (email: string) => {
  return db.user.update({
    where: { email: normalizeEmail(email) },
    data: { ericaRequestIdSenden: null },
  });
};

export const setUserIdentified = async (email: string) => {
  return db.user.update({
    where: { email: normalizeEmail(email) },
    data: {
      identified: true,
      identifiedAt: new Date(),
    },
  });
};

export const saveDeclaration = async (
  email: string,
  transferticket: string,
  pdf: string
) => {
  const pdfBuffer = Buffer.from(pdf, "base64");
  const user = await findUserByEmail(email);
  if (user?.pdf) {
    await deletePdf(email);
  }
  return db.user.update({
    where: { email: normalizeEmail(email) },
    data: {
      transferticket: transferticket,
      pdf: {
        create: {
          data: pdfBuffer,
        },
      },
      lastDeclarationAt: new Date(),
    },
  });
};

export const deleteTransferticket = async (email: string) => {
  return db.user.update({
    where: { email: normalizeEmail(email) },
    data: { transferticket: null },
  });
};

export const deletePdf = async (email: string) => {
  const user = await findUserByEmail(email);
  invariant(user, `User with given email not found.`);

  // prisma does not support deleteIfExists yet and throws an error on missing record
  if (user?.pdf) {
    return db.user.update({
      where: { email: normalizeEmail(email) },
      data: {
        pdf: {
          delete: true,
        },
      },
    });
  }
};

export const setUserInDeclarationProcess = async (
  email: string,
  inDeclarationProcess: boolean
) => {
  return db.user.update({
    where: { email: normalizeEmail(email) },
    data: { inDeclarationProcess: inDeclarationProcess },
  });
};

export const setUserInFscEingebenProcess = async (
  email: string,
  inFscEingebenProcess: boolean
) => {
  return db.user.update({
    where: { email: normalizeEmail(email) },
    data: { inFscEingebenProcess: inFscEingebenProcess },
  });
};

export const setUserInFscNeuBeantragenProcess = async (
  email: string,
  inFscNeuBeantragenProcess: boolean
) => {
  return db.user.update({
    where: { email: normalizeEmail(email) },
    data: { inFscNeuBeantragenProcess: inFscNeuBeantragenProcess },
  });
};

export const getAllEricaRequestIds = async () => {
  return db.user.findMany({
    select: {
      id: true,
      email: true,
      ericaRequestIdFscBeantragen: true,
      ericaRequestIdFscAktivieren: true,
      ericaRequestIdFscStornieren: true,
    },
    where: {
      OR: [
        { NOT: [{ ericaRequestIdFscBeantragen: null }] },
        { NOT: [{ ericaRequestIdFscAktivieren: null }] },
        { NOT: [{ ericaRequestIdFscStornieren: null }] },
      ],
    },
  });
};

export const deleteManyUsers = async (users: UserWithoutPdf[]) => {
  for (const user of users) {
    if (user.fscRequest) {
      await revokeFscForUser(user);
      await deleteFscRequest(user.email, user.fscRequest.requestId);
    }
  }
  const deleteAccounts = db.user.deleteMany({
    where: {
      email: {
        in: users.map((user) => user.email),
      },
    },
  });

  const logsToCreate = users.map((user) => {
    return {
      data: encryptAuditLogData({
        eventName: AuditLogEvent.ACCOUNT_DELETED,
        ipAddress: "cron",
        timestamp: Date.now(),
        username: user.email,
      }),
    };
  });

  const createAuditLogs = db.auditLog.createMany({
    data: logsToCreate,
  });

  const [deletedAccounts] = await db.$transaction([
    deleteAccounts,
    createAuditLogs,
  ]);

  return deletedAccounts.count;
};

export const deleteUser = async (user: UserWithoutPdf) => {
  return deleteManyUsers([user]);
};

export const deleteUserByEmail = async (email: string) => {
  const user = await findUserByEmail(email);
  if (user) {
    return deleteUser(user);
  }
  return 0;
};
