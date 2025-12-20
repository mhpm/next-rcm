/*
  Warnings:

  - A unique constraint covering the columns `[accessCode]` on the table `Cells` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateEnum
CREATE TYPE "ReportEntryStatus" AS ENUM ('DRAFT', 'SUBMITTED');

-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "ReportFieldType" ADD VALUE 'SECTION';
ALTER TYPE "ReportFieldType" ADD VALUE 'MEMBER_SELECT';

-- AlterTable
ALTER TABLE "Cells" ADD COLUMN     "accessCode" TEXT;

-- AlterTable
ALTER TABLE "report_entries" ADD COLUMN     "status" "ReportEntryStatus" NOT NULL DEFAULT 'SUBMITTED';

-- AlterTable
ALTER TABLE "report_fields" ADD COLUMN     "order" INTEGER NOT NULL DEFAULT 0;

-- CreateIndex
CREATE UNIQUE INDEX "Cells_accessCode_key" ON "Cells"("accessCode");
