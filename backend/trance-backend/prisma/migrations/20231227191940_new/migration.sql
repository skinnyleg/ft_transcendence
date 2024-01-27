/*
  Warnings:

  - You are about to drop the column `channelName` on the `Blacklist` table. All the data in the column will be lost.
  - Added the required column `channelId` to the `Blacklist` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Blacklist" DROP CONSTRAINT "Blacklist_channelName_fkey";

-- AlterTable
ALTER TABLE "Blacklist" DROP COLUMN "channelName",
ADD COLUMN     "channelId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Blacklist" ADD CONSTRAINT "Blacklist_channelId_fkey" FOREIGN KEY ("channelId") REFERENCES "Channel"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
