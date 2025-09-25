-- DropForeignKey
ALTER TABLE "public"."members" DROP CONSTRAINT "members_church_id_fkey";

-- AddForeignKey
ALTER TABLE "public"."members" ADD CONSTRAINT "members_church_id_fkey" FOREIGN KEY ("church_id") REFERENCES "public"."churches"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
