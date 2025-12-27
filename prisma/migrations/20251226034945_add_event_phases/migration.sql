-- AlterTable
ALTER TABLE "events" ADD COLUMN     "phase_id" TEXT;

-- CreateTable
CREATE TABLE "event_phases" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "color" TEXT,
    "church_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "event_phases_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "event_phases_church_id_idx" ON "event_phases"("church_id");

-- CreateIndex
CREATE INDEX "events_phase_id_idx" ON "events"("phase_id");

-- AddForeignKey
ALTER TABLE "events" ADD CONSTRAINT "events_phase_id_fkey" FOREIGN KEY ("phase_id") REFERENCES "event_phases"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "event_phases" ADD CONSTRAINT "event_phases_church_id_fkey" FOREIGN KEY ("church_id") REFERENCES "churches"("id") ON DELETE CASCADE ON UPDATE CASCADE;
