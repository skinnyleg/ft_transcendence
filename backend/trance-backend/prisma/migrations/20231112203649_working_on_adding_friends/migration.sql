/*
  Warnings:

  - Added the required column `friendId` to the `FriendStatus` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "FriendStatus" ADD COLUMN     "friendId" TEXT NOT NULL;
