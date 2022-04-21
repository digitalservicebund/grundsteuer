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
  return await db.user.update({
    where: { email: email },
    data: { ericaRequestIdFscBeantragen: ericaRequestId },
  });
};

export const deleteEricaRequestIdFscBeantragen = async (email: string) => {
  return await db.user.update({
    where: { email: email },
    data: { ericaRequestIdFscBeantragen: null },
  });
};
