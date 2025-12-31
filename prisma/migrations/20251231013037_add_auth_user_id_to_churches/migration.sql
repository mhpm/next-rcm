/*
  Warnings:

  - A unique constraint covering the columns `[auth_user_id]` on the table `members` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "churches" ADD COLUMN     "owner_id" TEXT;

-- AlterTable
ALTER TABLE "members" ADD COLUMN     "auth_user_id" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "members_auth_user_id_key" ON "members"("auth_user_id");
