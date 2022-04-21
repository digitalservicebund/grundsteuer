import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
const prisma = new PrismaClient();

async function main() {
  await prisma.user.create({
    data: { email: "foo@bar.com", password: await bcrypt.hash("12345678", 10) },
  });

  await prisma.user.create({
    data: {
      email: "identified-user@example.com",
      password: await bcrypt.hash("12345678", 10),
      identified: true,
    },
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
