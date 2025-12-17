-- AlterTable
ALTER TABLE "Cells" ADD COLUMN     "assistant_id" TEXT;

-- AddForeignKey
ALTER TABLE "Cells" ADD CONSTRAINT "Cells_assistant_id_fkey" FOREIGN KEY ("assistant_id") REFERENCES "members"("id") ON DELETE SET NULL ON UPDATE CASCADE;
