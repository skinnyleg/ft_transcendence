/*
  Warnings:

  - Added the required column `descriptionOfRequest` to the `Request` table without a default value. This is not possible if the table is not empty.
  - Added the required column `typeOfRequest` to the `Request` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Request" ADD COLUMN     "descriptionOfRequest" TEXT NOT NULL,
ADD COLUMN     "typeOfRequest" TEXT NOT NULL;
