-- AlterTable
ALTER TABLE "Request" ALTER COLUMN "expiresAt" SET DEFAULT NOW() + interval '10 second';
