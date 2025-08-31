/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `Expenses` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Expenses_name_key" ON "Expenses"("name");

-- alter sequence
ALTER SEQUENCE "Expenses_id_seq" RESTART WITH 1;