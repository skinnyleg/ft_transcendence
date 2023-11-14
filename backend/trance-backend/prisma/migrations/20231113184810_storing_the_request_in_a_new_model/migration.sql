-- CreateTable
CREATE TABLE "Request" (
    "id" SERIAL NOT NULL,
    "userId" TEXT NOT NULL,
    "friendId" TEXT NOT NULL,

    CONSTRAINT "Request_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Request" ADD CONSTRAINT "Request_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
