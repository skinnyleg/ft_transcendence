/*
  Warnings:

  - You are about to drop the column `losses` on the `Game` table. All the data in the column will be lost.
  - You are about to drop the column `score` on the `Game` table. All the data in the column will be lost.
  - You are about to drop the column `wins` on the `Game` table. All the data in the column will be lost.
  - Added the required column `opponentId` to the `Game` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Game" DROP COLUMN "losses",
DROP COLUMN "score",
DROP COLUMN "wins",
ADD COLUMN     "MatchScore" INTEGER[],
ADD COLUMN     "opponentId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Game" ADD CONSTRAINT "Game_opponentId_fkey" FOREIGN KEY ("opponentId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
