-- AlterEnum
ALTER TYPE "ReportFieldType" ADD VALUE 'SELECT';

-- AlterTable
ALTER TABLE "report_fields" ADD COLUMN     "options" JSONB;
