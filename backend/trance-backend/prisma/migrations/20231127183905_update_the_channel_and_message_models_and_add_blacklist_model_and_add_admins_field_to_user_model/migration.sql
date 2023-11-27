/*
  Warnings:

  - The primary key for the `Channel` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - A unique constraint covering the columns `[name]` on the table `Channel` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `name` to the `Channel` table without a default value. This is not possible if the table is not empty.
  - Added the required column `owner` to the `Channel` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Membership" AS ENUM ('BLOCKED', 'MUTED', 'KICK', 'BAN', 'ACTIVE');

-- CreateEnum
CREATE TYPE "Role" AS ENUM ('OWNER', 'ADMIN', 'MEMBER');

-- DropForeignKey
ALTER TABLE "Message" DROP CONSTRAINT "Message_channelId_fkey";

-- DropForeignKey
ALTER TABLE "_ChannelToUser" DROP CONSTRAINT "_ChannelToUser_A_fkey";

-- AlterTable
ALTER TABLE "Channel" DROP CONSTRAINT "Channel_pkey",
ADD COLUMN     "name" TEXT NOT NULL,
ADD COLUMN     "owner" TEXT NOT NULL,
ADD COLUMN     "password" TEXT,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "Channel_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Channel_id_seq";

-- AlterTable
ALTER TABLE "Message" ALTER COLUMN "channelId" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "_ChannelToUser" ALTER COLUMN "A" SET DATA TYPE TEXT;

-- CreateTable
CREATE TABLE "Blacklist" (
    "id" TEXT NOT NULL,
    "nickname" TEXT NOT NULL,
    "role" "Role" NOT NULL,
    "status" "Membership" NOT NULL,
    "expiredAt" TIMESTAMP(3) NOT NULL,
    "channelName" TEXT NOT NULL,

    CONSTRAINT "Blacklist_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_Admins" (
    "A" TEXT NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Blacklist_nickname_key" ON "Blacklist"("nickname");

-- CreateIndex
CREATE UNIQUE INDEX "_Admins_AB_unique" ON "_Admins"("A", "B");

-- CreateIndex
CREATE INDEX "_Admins_B_index" ON "_Admins"("B");

-- CreateIndex
CREATE UNIQUE INDEX "Channel_name_key" ON "Channel"("name");

-- AddForeignKey
ALTER TABLE "Blacklist" ADD CONSTRAINT "Blacklist_channelName_fkey" FOREIGN KEY ("channelName") REFERENCES "Channel"("name") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_channelId_fkey" FOREIGN KEY ("channelId") REFERENCES "Channel"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ChannelToUser" ADD CONSTRAINT "_ChannelToUser_A_fkey" FOREIGN KEY ("A") REFERENCES "Channel"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_Admins" ADD CONSTRAINT "_Admins_A_fkey" FOREIGN KEY ("A") REFERENCES "Channel"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_Admins" ADD CONSTRAINT "_Admins_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
