/*
  Warnings:

  - You are about to drop the column `score` on the `Achievement` table. All the data in the column will be lost.
  - Added the required column `totalScore` to the `Achievement` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userScore` to the `Achievement` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Achievement" DROP COLUMN "score",
ADD COLUMN     "totalScore" INTEGER NOT NULL,
ADD COLUMN     "userScore" INTEGER NOT NULL;
