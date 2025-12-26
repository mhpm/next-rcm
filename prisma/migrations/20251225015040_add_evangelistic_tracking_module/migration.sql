-- CreateTable
CREATE TABLE "cell_goals" (
    "id" TEXT NOT NULL,
    "cell_id" TEXT NOT NULL,
    "event_id" TEXT NOT NULL,
    "target" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "cell_goals_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "friends" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "phone" TEXT,
    "cell_id" TEXT NOT NULL,
    "invited_by_id" TEXT,
    "spiritual_father_id" TEXT NOT NULL,
    "is_baptized" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "friends_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "events" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "type" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "events_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "event_attendances" (
    "id" TEXT NOT NULL,
    "friend_id" TEXT NOT NULL,
    "event_id" TEXT NOT NULL,
    "attended" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "event_attendances_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "cell_goals_cell_id_idx" ON "cell_goals"("cell_id");

-- CreateIndex
CREATE INDEX "cell_goals_event_id_idx" ON "cell_goals"("event_id");

-- CreateIndex
CREATE UNIQUE INDEX "cell_goals_cell_id_event_id_key" ON "cell_goals"("cell_id", "event_id");

-- CreateIndex
CREATE INDEX "friends_cell_id_idx" ON "friends"("cell_id");

-- CreateIndex
CREATE INDEX "friends_invited_by_id_idx" ON "friends"("invited_by_id");

-- CreateIndex
CREATE INDEX "friends_spiritual_father_id_idx" ON "friends"("spiritual_father_id");

-- CreateIndex
CREATE INDEX "event_attendances_friend_id_idx" ON "event_attendances"("friend_id");

-- CreateIndex
CREATE INDEX "event_attendances_event_id_idx" ON "event_attendances"("event_id");

-- CreateIndex
CREATE UNIQUE INDEX "event_attendances_friend_id_event_id_key" ON "event_attendances"("friend_id", "event_id");

-- AddForeignKey
ALTER TABLE "cell_goals" ADD CONSTRAINT "cell_goals_cell_id_fkey" FOREIGN KEY ("cell_id") REFERENCES "Cells"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cell_goals" ADD CONSTRAINT "cell_goals_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "events"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "friends" ADD CONSTRAINT "friends_cell_id_fkey" FOREIGN KEY ("cell_id") REFERENCES "Cells"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "friends" ADD CONSTRAINT "friends_invited_by_id_fkey" FOREIGN KEY ("invited_by_id") REFERENCES "members"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "friends" ADD CONSTRAINT "friends_spiritual_father_id_fkey" FOREIGN KEY ("spiritual_father_id") REFERENCES "members"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "event_attendances" ADD CONSTRAINT "event_attendances_friend_id_fkey" FOREIGN KEY ("friend_id") REFERENCES "friends"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "event_attendances" ADD CONSTRAINT "event_attendances_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "events"("id") ON DELETE CASCADE ON UPDATE CASCADE;
