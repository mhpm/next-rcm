/*
  Warnings:

  - You are about to drop the column `auth_user_id` on the `members` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "members_auth_user_id_key";

-- AlterTable
ALTER TABLE "members" DROP COLUMN "auth_user_id";
