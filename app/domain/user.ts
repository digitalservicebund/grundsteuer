import { db } from "~/db/db.server";
import bcrypt from "bcryptjs";

export const createUser = async (email: string, password: string) => {
  const hash = bcrypt.hashSync(password, 10);

  try {
    await db.user.create({
      data: {
        email: email,
        password: hash,
      },
    });
  } catch (e) {
    console.error(e);
    throw new Error("Internal server error.");
  }
};

export const userExists = async (email: string) => {
  try {
    const user = await db.user.findFirst({
      where: { email: email },
    });
    return !!user;
  } catch (e) {
    console.error(e);
    throw new Error("Internal server error.");
  }
};
