/*
  Warnings:

  - Changed the type of `typeOfRequest` on the `Request` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "RequestType" AS ENUM ('FRIEND', 'CHALLENGE', 'MESSAGE');

-- AlterTable
ALTER TABLE "Request" DROP COLUMN "typeOfRequest",
ADD COLUMN     "typeOfRequest" "RequestType" NOT NULL;
