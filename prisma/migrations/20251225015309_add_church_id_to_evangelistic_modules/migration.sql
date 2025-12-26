/*
  Warnings:

  - Added the required column `church_id` to the `cell_goals` table without a default value. This is not possible if the table is not empty.
  - Added the required column `church_id` to the `event_attendances` table without a default value. This is not possible if the table is not empty.
  - Added the required column `church_id` to the `events` table without a default value. This is not possible if the table is not empty.
  - Added the required column `church_id` to the `friends` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "cell_goals" ADD COLUMN     "church_id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "event_attendances" ADD COLUMN     "church_id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "events" ADD COLUMN     "church_id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "friends" ADD COLUMN     "church_id" TEXT NOT NULL;

-- CreateIndex
CREATE INDEX "cell_goals_church_id_idx" ON "cell_goals"("church_id");

-- CreateIndex
CREATE INDEX "event_attendances_church_id_idx" ON "event_attendances"("church_id");

-- CreateIndex
CREATE INDEX "events_church_id_idx" ON "events"("church_id");

-- CreateIndex
CREATE INDEX "friends_church_id_idx" ON "friends"("church_id");

-- AddForeignKey
ALTER TABLE "cell_goals" ADD CONSTRAINT "cell_goals_church_id_fkey" FOREIGN KEY ("church_id") REFERENCES "churches"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "friends" ADD CONSTRAINT "friends_church_id_fkey" FOREIGN KEY ("church_id") REFERENCES "churches"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "events" ADD CONSTRAINT "events_church_id_fkey" FOREIGN KEY ("church_id") REFERENCES "churches"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "event_attendances" ADD CONSTRAINT "event_attendances_church_id_fkey" FOREIGN KEY ("church_id") REFERENCES "churches"("id") ON DELETE CASCADE ON UPDATE CASCADE;
