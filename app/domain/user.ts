import { db } from "~/db.server";
import { Prisma } from "@prisma/client";
import invariant from "tiny-invariant";

export type User = Prisma.UserGetPayload<{
  include: { fscRequest: true; pdf: true };
}>;

export const createUser = async (email: string) => {
  return db.user.create({
    data: {
      email: email,
    },
  });
};

export const userExists = async (email: string) => {
  const user = await db.user.findFirst({
    where: { email: email },
  });
  return !!user;
};

export const findUserByEmail = async (email: string): Promise<User | null> => {
  const normalizedEmail = email.trim().toLowerCase();
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

export const saveFscRequest = async (email: string, requestId: string) => {
  const user = await findUserByEmail(email);
  if (!user) {
    throw new Error("User not found.");
  }

  await db.fscRequest.create({
    data: {
      requestId: requestId,
      User: { connect: { email: email } },
    },
  });
};

export const deleteFscRequest = async (
  email: string,
  requestIdToDelete: string
) => {
  const user = await findUserByEmail(email);
  if (!user) {
    throw new Error("User not found.");
  }

  await db.fscRequest.deleteMany({
    where: {
      userId: user.id,
      requestId: requestIdToDelete,
    },
  });
};

export const saveEricaRequestIdFscBeantragen = async (
  email: string,
  ericaRequestId: string
) => {
  return db.user.update({
    where: { email: email },
    data: { ericaRequestIdFscBeantragen: ericaRequestId },
  });
};

export const deleteEricaRequestIdFscBeantragen = async (email: string) => {
  return db.user.update({
    where: { email: email },
    data: { ericaRequestIdFscBeantragen: null },
  });
};

export const saveEricaRequestIdFscAktivieren = async (
  email: string,
  ericaRequestId: string
) => {
  return db.user.update({
    where: { email: email },
    data: { ericaRequestIdFscAktivieren: ericaRequestId },
  });
};

export const deleteEricaRequestIdFscAktivieren = async (email: string) => {
  return db.user.update({
    where: { email: email },
    data: { ericaRequestIdFscAktivieren: null },
  });
};

export const saveEricaRequestIdFscStornieren = async (
  email: string,
  ericaRequestId: string
) => {
  return db.user.update({
    where: { email: email },
    data: { ericaRequestIdFscStornieren: ericaRequestId },
  });
};

export const deleteEricaRequestIdFscStornieren = async (email: string) => {
  return db.user.update({
    where: { email: email },
    data: { ericaRequestIdFscStornieren: null },
  });
};

export const saveEricaRequestIdSenden = async (
  email: string,
  ericaRequestId: string
) => {
  return db.user.update({
    where: { email: email },
    data: { ericaRequestIdSenden: ericaRequestId },
  });
};

export const deleteEricaRequestIdSenden = async (email: string) => {
  return db.user.update({
    where: { email: email },
    data: { ericaRequestIdSenden: null },
  });
};

export const setUserIdentified = async (email: string, identified: boolean) => {
  if (identified) {
    return db.user.update({
      where: { email: email },
      data: {
        identified: identified,
        identifiedAt: new Date(),
      },
    });
  } else {
    return db.user.update({
      where: { email: email },
      data: {
        identified: identified,
        identifiedAt: null,
      },
    });
  }
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
    where: { email: email },
    data: {
      transferticket: transferticket,
      pdf: {
        create: {
          data: pdfBuffer,
        },
      },
    },
  });
};

export const deleteTransferticket = async (email: string) => {
  return db.user.update({
    where: { email: email },
    data: { transferticket: null },
  });
};

export const deletePdf = async (email: string) => {
  const user = await findUserByEmail(email);
  invariant(user, `User with given email not found.`);

  // prisma does not support deleteIfExists yet and throws an error on missing record
  if (user?.pdf) {
    return db.user.update({
      where: { email: email },
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
    where: { email: email },
    data: { inDeclarationProcess: inDeclarationProcess },
  });
};
