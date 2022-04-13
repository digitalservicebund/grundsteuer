import { db } from "~/db.server";
import bcrypt from "bcryptjs";
import { FscRequest, User as PrismaUser } from "@prisma/client";

export type User = PrismaUser & { fscRequest: FscRequest[] };

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
