/*
  Warnings:

  - The primary key for the `Achievement` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `Channel` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `Chat` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `FriendStatus` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `Match` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `Message` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `Request` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - Added the required column `title` to the `Match` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Message" DROP CONSTRAINT "Message_channelId_fkey";

-- DropForeignKey
ALTER TABLE "Message" DROP CONSTRAINT "Message_chatId_fkey";

-- DropForeignKey
ALTER TABLE "_ChannelToUser" DROP CONSTRAINT "_ChannelToUser_A_fkey";

-- AlterTable
ALTER TABLE "Achievement" DROP CONSTRAINT "Achievement_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "Achievement_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Achievement_id_seq";

-- AlterTable
ALTER TABLE "Channel" DROP CONSTRAINT "Channel_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "Channel_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Channel_id_seq";

-- AlterTable
ALTER TABLE "Chat" DROP CONSTRAINT "Chat_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "Chat_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Chat_id_seq";

-- AlterTable
ALTER TABLE "FriendStatus" DROP CONSTRAINT "FriendStatus_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "FriendStatus_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "FriendStatus_id_seq";

-- AlterTable
ALTER TABLE "Match" DROP CONSTRAINT "Match_pkey",
ADD COLUMN     "title" TEXT NOT NULL,
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "Match_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Match_id_seq";

-- AlterTable
ALTER TABLE "Message" DROP CONSTRAINT "Message_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "channelId" SET DATA TYPE TEXT,
ALTER COLUMN "chatId" SET DATA TYPE TEXT,
ADD CONSTRAINT "Message_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Message_id_seq";

-- AlterTable
ALTER TABLE "Request" DROP CONSTRAINT "Request_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "Request_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Request_id_seq";

-- AlterTable
ALTER TABLE "_ChannelToUser" ALTER COLUMN "A" SET DATA TYPE TEXT;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_channelId_fkey" FOREIGN KEY ("channelId") REFERENCES "Channel"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_chatId_fkey" FOREIGN KEY ("chatId") REFERENCES "Chat"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ChannelToUser" ADD CONSTRAINT "_ChannelToUser_A_fkey" FOREIGN KEY ("A") REFERENCES "Channel"("id") ON DELETE CASCADE ON UPDATE CASCADE;
