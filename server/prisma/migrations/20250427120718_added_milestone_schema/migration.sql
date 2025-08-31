/*
  Warnings:

  - Made the column `userId` on table `Expenses` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Expenses" DROP CONSTRAINT "Expenses_userId_fkey";

-- AlterTable
ALTER TABLE "Expenses" ALTER COLUMN "userId" SET NOT NULL;

-- CreateTable
CREATE TABLE "Milestone" (
    "id" SERIAL NOT NULL,
    "task" TEXT NOT NULL,
    "reward" TEXT NOT NULL,
    "completed" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "Milestone_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Expenses" ADD CONSTRAINT "Expenses_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Milestone" ADD CONSTRAINT "Milestone_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
