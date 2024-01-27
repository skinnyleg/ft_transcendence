/*
  Warnings:

  - A unique constraint covering the columns `[channelName]` on the table `Request` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `loserScore` to the `Game` table without a default value. This is not possible if the table is not empty.
  - Added the required column `winner` to the `Game` table without a default value. This is not possible if the table is not empty.
  - Added the required column `winnerScore` to the `Game` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Game" ADD COLUMN     "loserScore" INTEGER NOT NULL,
ADD COLUMN     "winner" TEXT NOT NULL,
ADD COLUMN     "winnerScore" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Request" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "expiresAt" TIMESTAMP(3) NOT NULL DEFAULT NOW() + interval '10 second';

-- CreateIndex
CREATE UNIQUE INDEX "Request_channelName_key" ON "Request"("channelName");
