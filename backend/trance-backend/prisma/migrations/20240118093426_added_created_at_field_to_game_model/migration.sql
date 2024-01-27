-- AlterTable
ALTER TABLE "Game" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "Request" ALTER COLUMN "expiresAt" SET DEFAULT NOW() + interval '10 second';
