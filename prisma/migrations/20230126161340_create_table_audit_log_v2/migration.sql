-- CreateTable
CREATE TABLE "AuditLogV2" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "version" TEXT NOT NULL,
    "user" TEXT NOT NULL,
    "data" TEXT NOT NULL,

    CONSTRAINT "AuditLogV2_pkey" PRIMARY KEY ("id")
);
