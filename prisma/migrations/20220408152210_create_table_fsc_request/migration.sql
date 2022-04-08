-- AlterTable
ALTER TABLE "User" DROP COLUMN "fscRequestId";

-- CreateTable
CREATE TABLE "FscRequest" (
    "id" TEXT NOT NULL,
    "requestId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT NOT NULL,

    CONSTRAINT "FscRequest_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "FscRequest" ADD CONSTRAINT "FscRequest_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
