/*
  Warnings:

  - A unique constraint covering the columns `[publicToken]` on the table `reports` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "reports" ADD COLUMN     "publicToken" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "reports_publicToken_key" ON "reports"("publicToken");
