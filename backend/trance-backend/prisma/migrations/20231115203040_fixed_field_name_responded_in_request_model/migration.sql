/*
  Warnings:

  - You are about to drop the column `reponded` on the `Request` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Request" DROP COLUMN "reponded",
ADD COLUMN     "responded" BOOLEAN NOT NULL DEFAULT false;
