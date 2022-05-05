import { db } from "~/db.server";
import bcrypt from "bcryptjs";
import { Prisma } from "@prisma/client";

export type User = Prisma.UserGetPayload<{ include: { fscRequest: true } }>;

export const createUser = async (email: string, password: string) => {
  const hash = bcrypt.hashSync(password, 10);
  await db.user.create({
    data: {
      email: email,
      password: hash,
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
  return db.user.findUnique({
    where: {
      email: email,
    },
    include: {
      fscRequest: true,
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
  return db.user.update({
    where: { email: email },
    data: { identified: identified },
  });
};

export const saveTransferticket = async (
  email: string,
  transferticket: string
) => {
  return db.user.update({
    where: { email: email },
    data: { transferticket: transferticket },
  });
};

export const savePdf = async (email: string, pdf: Buffer) => {
  return db.user.update({
    where: { email: email },
    data: { pdf: pdf },
  });
};
