/*
  Warnings:

  - You are about to drop the column `sector_id` on the `Cells` table. All the data in the column will be lost.
  - You are about to drop the column `leader_id` on the `sectors` table. All the data in the column will be lost.
  - You are about to drop the column `parent_id` on the `sectors` table. All the data in the column will be lost.

*/
-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "ReportScope" ADD VALUE 'SUBSECTOR';
ALTER TYPE "ReportScope" ADD VALUE 'ZONE';

-- DropForeignKey
ALTER TABLE "Cells" DROP CONSTRAINT "Cells_sector_id_fkey";

-- DropForeignKey
ALTER TABLE "sectors" DROP CONSTRAINT "sectors_leader_id_fkey";

-- DropForeignKey
ALTER TABLE "sectors" DROP CONSTRAINT "sectors_parent_id_fkey";

-- DropIndex
DROP INDEX "Cells_sector_id_idx";

-- DropIndex
DROP INDEX "sectors_leader_id_idx";

-- DropIndex
DROP INDEX "sectors_parent_id_idx";

-- AlterTable
ALTER TABLE "Cells" DROP COLUMN "sector_id",
ADD COLUMN     "sub_sector_id" TEXT;

-- AlterTable
ALTER TABLE "members" ADD COLUMN     "sub_sector_id" TEXT,
ADD COLUMN     "zone_id" TEXT;

-- AlterTable
ALTER TABLE "report_entries" ADD COLUMN     "sub_sector_id" TEXT,
ADD COLUMN     "zone_id" TEXT;

-- AlterTable
ALTER TABLE "reports" ADD COLUMN     "sub_sector_id" TEXT,
ADD COLUMN     "zone_id" TEXT;

-- AlterTable
ALTER TABLE "sectors" DROP COLUMN "leader_id",
DROP COLUMN "parent_id",
ADD COLUMN     "supervisor_id" TEXT,
ADD COLUMN     "zone_id" TEXT;

-- CreateTable
CREATE TABLE "zones" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "church_id" TEXT NOT NULL,
    "supervisor_id" TEXT,

    CONSTRAINT "zones_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sub_sectors" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "sector_id" TEXT,
    "supervisor_id" TEXT,

    CONSTRAINT "sub_sectors_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "zones_church_id_idx" ON "zones"("church_id");

-- CreateIndex
CREATE INDEX "zones_supervisor_id_idx" ON "zones"("supervisor_id");

-- CreateIndex
CREATE INDEX "sub_sectors_sector_id_idx" ON "sub_sectors"("sector_id");

-- CreateIndex
CREATE INDEX "sub_sectors_supervisor_id_idx" ON "sub_sectors"("supervisor_id");

-- CreateIndex
CREATE INDEX "Cells_sub_sector_id_idx" ON "Cells"("sub_sector_id");

-- CreateIndex
CREATE INDEX "members_zone_id_idx" ON "members"("zone_id");

-- CreateIndex
CREATE INDEX "members_sub_sector_id_idx" ON "members"("sub_sector_id");

-- CreateIndex
CREATE INDEX "report_entries_sub_sector_id_idx" ON "report_entries"("sub_sector_id");

-- CreateIndex
CREATE INDEX "report_entries_zone_id_idx" ON "report_entries"("zone_id");

-- CreateIndex
CREATE INDEX "reports_sub_sector_id_idx" ON "reports"("sub_sector_id");

-- CreateIndex
CREATE INDEX "reports_zone_id_idx" ON "reports"("zone_id");

-- CreateIndex
CREATE INDEX "sectors_zone_id_idx" ON "sectors"("zone_id");

-- CreateIndex
CREATE INDEX "sectors_supervisor_id_idx" ON "sectors"("supervisor_id");

-- AddForeignKey
ALTER TABLE "members" ADD CONSTRAINT "members_zone_id_fkey" FOREIGN KEY ("zone_id") REFERENCES "zones"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "members" ADD CONSTRAINT "members_sub_sector_id_fkey" FOREIGN KEY ("sub_sector_id") REFERENCES "sub_sectors"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Cells" ADD CONSTRAINT "Cells_sub_sector_id_fkey" FOREIGN KEY ("sub_sector_id") REFERENCES "sub_sectors"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "zones" ADD CONSTRAINT "zones_church_id_fkey" FOREIGN KEY ("church_id") REFERENCES "churches"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "zones" ADD CONSTRAINT "zones_supervisor_id_fkey" FOREIGN KEY ("supervisor_id") REFERENCES "members"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sectors" ADD CONSTRAINT "sectors_zone_id_fkey" FOREIGN KEY ("zone_id") REFERENCES "zones"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sectors" ADD CONSTRAINT "sectors_supervisor_id_fkey" FOREIGN KEY ("supervisor_id") REFERENCES "members"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sub_sectors" ADD CONSTRAINT "sub_sectors_sector_id_fkey" FOREIGN KEY ("sector_id") REFERENCES "sectors"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sub_sectors" ADD CONSTRAINT "sub_sectors_supervisor_id_fkey" FOREIGN KEY ("supervisor_id") REFERENCES "members"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reports" ADD CONSTRAINT "reports_sub_sector_id_fkey" FOREIGN KEY ("sub_sector_id") REFERENCES "sub_sectors"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reports" ADD CONSTRAINT "reports_zone_id_fkey" FOREIGN KEY ("zone_id") REFERENCES "zones"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "report_entries" ADD CONSTRAINT "report_entries_sub_sector_id_fkey" FOREIGN KEY ("sub_sector_id") REFERENCES "sub_sectors"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "report_entries" ADD CONSTRAINT "report_entries_zone_id_fkey" FOREIGN KEY ("zone_id") REFERENCES "zones"("id") ON DELETE CASCADE ON UPDATE CASCADE;
