-- CreateEnum
CREATE TYPE "ReportFieldType" AS ENUM ('TEXT', 'NUMBER', 'BOOLEAN', 'DATE', 'JSON');

-- CreateEnum
CREATE TYPE "ReportScope" AS ENUM ('CELL', 'GROUP', 'SECTOR', 'CHURCH');

-- CreateTable
CREATE TABLE "reports" (
    "id" TEXT NOT NULL,
    "church_id" TEXT NOT NULL,
    "scope" "ReportScope" NOT NULL DEFAULT 'CELL',
    "cell_id" TEXT,
    "group_id" TEXT,
    "sector_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "reports_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "report_fields" (
    "id" TEXT NOT NULL,
    "report_id" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "label" TEXT,
    "type" "ReportFieldType" NOT NULL DEFAULT 'TEXT',
    "value" JSONB,
    "required" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "report_fields_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "reports_church_id_idx" ON "reports"("church_id");

-- CreateIndex
CREATE INDEX "reports_cell_id_idx" ON "reports"("cell_id");

-- CreateIndex
CREATE INDEX "reports_group_id_idx" ON "reports"("group_id");

-- CreateIndex
CREATE INDEX "reports_sector_id_idx" ON "reports"("sector_id");

-- CreateIndex
CREATE INDEX "report_fields_report_id_idx" ON "report_fields"("report_id");

-- CreateIndex
CREATE UNIQUE INDEX "report_fields_report_id_key_key" ON "report_fields"("report_id", "key");

-- AddForeignKey
ALTER TABLE "reports" ADD CONSTRAINT "reports_church_id_fkey" FOREIGN KEY ("church_id") REFERENCES "churches"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reports" ADD CONSTRAINT "reports_cell_id_fkey" FOREIGN KEY ("cell_id") REFERENCES "Cells"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reports" ADD CONSTRAINT "reports_group_id_fkey" FOREIGN KEY ("group_id") REFERENCES "groups"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reports" ADD CONSTRAINT "reports_sector_id_fkey" FOREIGN KEY ("sector_id") REFERENCES "sectors"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "report_fields" ADD CONSTRAINT "report_fields_report_id_fkey" FOREIGN KEY ("report_id") REFERENCES "reports"("id") ON DELETE CASCADE ON UPDATE CASCADE;
