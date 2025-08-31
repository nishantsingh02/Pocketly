-- CreateTable
CREATE TABLE "Expenses" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "category" TEXT NOT NULL,

    CONSTRAINT "Expenses_pkey" PRIMARY KEY ("id")
);
