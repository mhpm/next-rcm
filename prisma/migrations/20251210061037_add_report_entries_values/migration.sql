-- CreateTable
CREATE TABLE "report_entries" (
    "id" TEXT NOT NULL,
    "church_id" TEXT NOT NULL,
    "report_id" TEXT NOT NULL,
    "scope" "ReportScope" NOT NULL DEFAULT 'CELL',
    "cell_id" TEXT,
    "group_id" TEXT,
    "sector_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "report_entries_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "report_entry_values" (
    "id" TEXT NOT NULL,
    "entry_id" TEXT NOT NULL,
    "report_field_id" TEXT NOT NULL,
    "value" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "report_entry_values_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "report_entries_church_id_idx" ON "report_entries"("church_id");

-- CreateIndex
CREATE INDEX "report_entries_report_id_idx" ON "report_entries"("report_id");

-- CreateIndex
CREATE INDEX "report_entries_cell_id_idx" ON "report_entries"("cell_id");

-- CreateIndex
CREATE INDEX "report_entries_group_id_idx" ON "report_entries"("group_id");

-- CreateIndex
CREATE INDEX "report_entries_sector_id_idx" ON "report_entries"("sector_id");

-- CreateIndex
CREATE INDEX "report_entry_values_entry_id_idx" ON "report_entry_values"("entry_id");

-- CreateIndex
CREATE INDEX "report_entry_values_report_field_id_idx" ON "report_entry_values"("report_field_id");

-- AddForeignKey
ALTER TABLE "report_entries" ADD CONSTRAINT "report_entries_church_id_fkey" FOREIGN KEY ("church_id") REFERENCES "churches"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "report_entries" ADD CONSTRAINT "report_entries_report_id_fkey" FOREIGN KEY ("report_id") REFERENCES "reports"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "report_entries" ADD CONSTRAINT "report_entries_cell_id_fkey" FOREIGN KEY ("cell_id") REFERENCES "Cells"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "report_entries" ADD CONSTRAINT "report_entries_group_id_fkey" FOREIGN KEY ("group_id") REFERENCES "groups"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "report_entries" ADD CONSTRAINT "report_entries_sector_id_fkey" FOREIGN KEY ("sector_id") REFERENCES "sectors"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "report_entry_values" ADD CONSTRAINT "report_entry_values_entry_id_fkey" FOREIGN KEY ("entry_id") REFERENCES "report_entries"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "report_entry_values" ADD CONSTRAINT "report_entry_values_report_field_id_fkey" FOREIGN KEY ("report_field_id") REFERENCES "report_fields"("id") ON DELETE CASCADE ON UPDATE CASCADE;
