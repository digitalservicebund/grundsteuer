-- AlterTable
ALTER TABLE "User" ADD COLUMN     "inFscEingebenProcess" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "inFscNeuBeantragenProcess" BOOLEAN NOT NULL DEFAULT false;
