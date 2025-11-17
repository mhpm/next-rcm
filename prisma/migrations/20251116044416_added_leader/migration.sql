/*
  Warnings:

  - You are about to drop the column `skills` on the `members` table. All the data in the column will be lost.

*/
-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "member_role" ADD VALUE 'PASTOR';
ALTER TYPE "member_role" ADD VALUE 'TESORERO';

-- AlterTable
ALTER TABLE "members" DROP COLUMN "skills",
ALTER COLUMN "gender" SET DEFAULT 'MASCULINO';

-- AlterTable
ALTER TABLE "ministries" ADD COLUMN     "leader_id" TEXT;

-- CreateIndex
CREATE INDEX "ministries_leader_id_idx" ON "ministries"("leader_id");

-- AddForeignKey
ALTER TABLE "ministries" ADD CONSTRAINT "ministries_leader_id_fkey" FOREIGN KEY ("leader_id") REFERENCES "members"("id") ON DELETE SET NULL ON UPDATE CASCADE;
