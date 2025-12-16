-- AlterTable
ALTER TABLE "sectors" ADD COLUMN     "parent_id" TEXT;

-- CreateIndex
CREATE INDEX "sectors_parent_id_idx" ON "sectors"("parent_id");

-- AddForeignKey
ALTER TABLE "sectors" ADD CONSTRAINT "sectors_parent_id_fkey" FOREIGN KEY ("parent_id") REFERENCES "sectors"("id") ON DELETE SET NULL ON UPDATE CASCADE;
