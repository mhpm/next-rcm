-- AlterTable
ALTER TABLE "members" ADD COLUMN     "cell_id" TEXT,
ADD COLUMN     "sector_id" TEXT;

-- CreateTable
CREATE TABLE "Cells" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "church_id" TEXT NOT NULL,
    "sector_id" TEXT NOT NULL,
    "leader_id" TEXT,
    "host_id" TEXT,

    CONSTRAINT "Cells_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sectors" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "church_id" TEXT NOT NULL,
    "leader_id" TEXT,

    CONSTRAINT "sectors_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Cells_church_id_idx" ON "Cells"("church_id");

-- CreateIndex
CREATE INDEX "Cells_sector_id_idx" ON "Cells"("sector_id");

-- CreateIndex
CREATE INDEX "Cells_leader_id_idx" ON "Cells"("leader_id");

-- CreateIndex
CREATE INDEX "Cells_host_id_idx" ON "Cells"("host_id");

-- CreateIndex
CREATE INDEX "sectors_church_id_idx" ON "sectors"("church_id");

-- CreateIndex
CREATE INDEX "sectors_leader_id_idx" ON "sectors"("leader_id");

-- CreateIndex
CREATE INDEX "members_cell_id_idx" ON "members"("cell_id");

-- CreateIndex
CREATE INDEX "members_sector_id_idx" ON "members"("sector_id");

-- AddForeignKey
ALTER TABLE "members" ADD CONSTRAINT "members_cell_id_fkey" FOREIGN KEY ("cell_id") REFERENCES "Cells"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "members" ADD CONSTRAINT "members_sector_id_fkey" FOREIGN KEY ("sector_id") REFERENCES "sectors"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Cells" ADD CONSTRAINT "Cells_church_id_fkey" FOREIGN KEY ("church_id") REFERENCES "churches"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Cells" ADD CONSTRAINT "Cells_sector_id_fkey" FOREIGN KEY ("sector_id") REFERENCES "sectors"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Cells" ADD CONSTRAINT "Cells_leader_id_fkey" FOREIGN KEY ("leader_id") REFERENCES "members"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Cells" ADD CONSTRAINT "Cells_host_id_fkey" FOREIGN KEY ("host_id") REFERENCES "members"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sectors" ADD CONSTRAINT "sectors_church_id_fkey" FOREIGN KEY ("church_id") REFERENCES "churches"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sectors" ADD CONSTRAINT "sectors_leader_id_fkey" FOREIGN KEY ("leader_id") REFERENCES "members"("id") ON DELETE SET NULL ON UPDATE CASCADE;
