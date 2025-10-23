/*
  Warnings:

  - You are about to drop the column `createdAt` on the `churches` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `churches` table. All the data in the column will be lost.
  - You are about to drop the column `ministerio` on the `members` table. All the data in the column will be lost.
  - Added the required column `updated_at` to the `churches` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "churches" DROP COLUMN "createdAt",
DROP COLUMN "updatedAt",
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "members" DROP COLUMN "ministerio";

-- CreateTable
CREATE TABLE "ministries" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "church_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ministries_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "member_ministries" (
    "id" TEXT NOT NULL,
    "member_id" TEXT NOT NULL,
    "ministry_id" TEXT NOT NULL,
    "church_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "member_ministries_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ministries_church_id_idx" ON "ministries"("church_id");

-- CreateIndex
CREATE UNIQUE INDEX "ministries_name_church_id_key" ON "ministries"("name", "church_id");

-- CreateIndex
CREATE INDEX "member_ministries_church_id_idx" ON "member_ministries"("church_id");

-- CreateIndex
CREATE UNIQUE INDEX "member_ministries_member_id_ministry_id_key" ON "member_ministries"("member_id", "ministry_id");

-- AddForeignKey
ALTER TABLE "members" ADD CONSTRAINT "members_church_id_fkey" FOREIGN KEY ("church_id") REFERENCES "churches"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ministries" ADD CONSTRAINT "ministries_church_id_fkey" FOREIGN KEY ("church_id") REFERENCES "churches"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "member_ministries" ADD CONSTRAINT "member_ministries_member_id_fkey" FOREIGN KEY ("member_id") REFERENCES "members"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "member_ministries" ADD CONSTRAINT "member_ministries_ministry_id_fkey" FOREIGN KEY ("ministry_id") REFERENCES "ministries"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "member_ministries" ADD CONSTRAINT "member_ministries_church_id_fkey" FOREIGN KEY ("church_id") REFERENCES "churches"("id") ON DELETE CASCADE ON UPDATE CASCADE;
