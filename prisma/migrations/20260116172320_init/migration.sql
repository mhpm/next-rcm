-- CreateEnum
CREATE TYPE "GroupFieldType" AS ENUM ('TEXT', 'NUMBER', 'BOOLEAN', 'DATE', 'JSON');

-- CreateEnum
CREATE TYPE "ReportFieldType" AS ENUM ('TEXT', 'NUMBER', 'CURRENCY', 'BOOLEAN', 'DATE', 'JSON', 'SELECT', 'SECTION', 'MEMBER_SELECT', 'FRIEND_REGISTRATION', 'CYCLE_WEEK_INDICATOR');

-- CreateEnum
CREATE TYPE "ReportScope" AS ENUM ('CELL', 'GROUP', 'SUBSECTOR', 'SECTOR', 'ZONE', 'CHURCH');

-- CreateEnum
CREATE TYPE "ReportEntryStatus" AS ENUM ('DRAFT', 'SUBMITTED');

-- CreateEnum
CREATE TYPE "member_role" AS ENUM ('MIEMBRO', 'SUPERVISOR', 'LIDER', 'ANFITRION', 'PASTOR', 'TESORERO');

-- CreateEnum
CREATE TYPE "gender" AS ENUM ('MASCULINO', 'FEMENINO');

-- CreateTable
CREATE TABLE "churches" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "email" TEXT,
    "phone" TEXT,
    "street" TEXT,
    "city" TEXT,
    "state" TEXT,
    "zip" TEXT,
    "country" TEXT DEFAULT 'México',
    "type_id" TEXT,
    "owner_id" TEXT,

    CONSTRAINT "churches_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "church_admins" (
    "id" TEXT NOT NULL,
    "church_id" TEXT NOT NULL,
    "user_id" TEXT,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "role" TEXT NOT NULL DEFAULT 'ADMIN',
    "permissions" JSONB DEFAULT '{}',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "church_admins_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "church_types" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "church_types_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "networks" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "church_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "networks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "members" (
    "id" TEXT NOT NULL,
    "first_name" TEXT NOT NULL,
    "last_name" TEXT NOT NULL,
    "email" TEXT,
    "phone" TEXT,
    "age" INTEGER,
    "street" TEXT,
    "city" TEXT,
    "state" TEXT,
    "zip" TEXT,
    "country" TEXT DEFAULT 'México',
    "birth_date" TIMESTAMP(3),
    "baptism_date" TIMESTAMP(3),
    "role" "member_role" NOT NULL DEFAULT 'MIEMBRO',
    "gender" "gender" NOT NULL DEFAULT 'MASCULINO',
    "picture_url" TEXT,
    "notes" TEXT,
    "password_hash" TEXT,
    "church_id" TEXT NOT NULL,
    "zone_id" TEXT,
    "sector_id" TEXT,
    "sub_sector_id" TEXT,
    "cell_id" TEXT,
    "network_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "members_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ministries" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "church_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "leader_id" TEXT,

    CONSTRAINT "ministries_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Cells" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "church_id" TEXT NOT NULL,
    "sub_sector_id" TEXT,
    "leader_id" TEXT,
    "host_id" TEXT,
    "assistant_id" TEXT,
    "accessCode" TEXT,

    CONSTRAINT "Cells_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "zones" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "church_id" TEXT NOT NULL,
    "supervisor_id" TEXT,

    CONSTRAINT "zones_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sectors" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "church_id" TEXT NOT NULL,
    "zone_id" TEXT,
    "supervisor_id" TEXT,

    CONSTRAINT "sectors_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sub_sectors" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "sector_id" TEXT,
    "supervisor_id" TEXT,

    CONSTRAINT "sub_sectors_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "groups" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "leader_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "church_id" TEXT NOT NULL,
    "parent_id" TEXT,

    CONSTRAINT "groups_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "group_fields" (
    "id" TEXT NOT NULL,
    "group_id" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "label" TEXT,
    "type" "GroupFieldType" NOT NULL DEFAULT 'TEXT',
    "value" JSONB,
    "required" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "group_fields_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cell_goals" (
    "id" TEXT NOT NULL,
    "church_id" TEXT NOT NULL,
    "cell_id" TEXT NOT NULL,
    "event_id" TEXT NOT NULL,
    "target" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "cell_goals_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "reports" (
    "id" TEXT NOT NULL,
    "church_id" TEXT NOT NULL,
    "scope" "ReportScope" NOT NULL DEFAULT 'CELL',
    "title" TEXT NOT NULL,
    "description" TEXT,
    "color" TEXT DEFAULT '#3b82f6',
    "slug" TEXT,
    "publicToken" TEXT,
    "cell_id" TEXT,
    "group_id" TEXT,
    "zone_id" TEXT,
    "sector_id" TEXT,
    "sub_sector_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "reports_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "report_fields" (
    "id" TEXT NOT NULL,
    "report_id" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "label" TEXT,
    "description" TEXT,
    "type" "ReportFieldType" NOT NULL DEFAULT 'TEXT',
    "value" JSONB,
    "options" JSONB,
    "validation" JSONB,
    "visibility_rules" JSONB,
    "required" BOOLEAN NOT NULL DEFAULT false,
    "order" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "report_fields_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "report_entries" (
    "id" TEXT NOT NULL,
    "church_id" TEXT NOT NULL,
    "report_id" TEXT NOT NULL,
    "scope" "ReportScope" NOT NULL DEFAULT 'CELL',
    "cell_id" TEXT,
    "group_id" TEXT,
    "zone_id" TEXT,
    "sector_id" TEXT,
    "sub_sector_id" TEXT,
    "status" "ReportEntryStatus" NOT NULL DEFAULT 'SUBMITTED',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "report_entries_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "report_entry_values" (
    "id" TEXT NOT NULL,
    "entry_id" TEXT NOT NULL,
    "report_field_id" TEXT NOT NULL,
    "value" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "report_entry_values_pkey" PRIMARY KEY ("id")
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

-- CreateTable
CREATE TABLE "friends" (
    "id" TEXT NOT NULL,
    "church_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "phone" TEXT,
    "cell_id" TEXT NOT NULL,
    "invited_by_id" TEXT,
    "spiritual_father_id" TEXT,
    "is_baptized" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "friends_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "events" (
    "id" TEXT NOT NULL,
    "church_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "type" TEXT NOT NULL,
    "friend_attendance_goal" INTEGER,
    "member_attendance_goal" INTEGER,
    "phase_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "events_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "event_attendances" (
    "id" TEXT NOT NULL,
    "church_id" TEXT NOT NULL,
    "friend_id" TEXT NOT NULL,
    "event_id" TEXT NOT NULL,
    "attended" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "event_attendances_pkey" PRIMARY KEY ("id")
);

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

-- CreateTable
CREATE TABLE "_MemberGroup" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_MemberGroup_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "churches_slug_key" ON "churches"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "churches_email_key" ON "churches"("email");

-- CreateIndex
CREATE UNIQUE INDEX "church_admins_church_id_email_key" ON "church_admins"("church_id", "email");

-- CreateIndex
CREATE UNIQUE INDEX "church_types_name_key" ON "church_types"("name");

-- CreateIndex
CREATE INDEX "networks_church_id_idx" ON "networks"("church_id");

-- CreateIndex
CREATE UNIQUE INDEX "networks_name_church_id_key" ON "networks"("name", "church_id");

-- CreateIndex
CREATE UNIQUE INDEX "members_email_key" ON "members"("email");

-- CreateIndex
CREATE INDEX "members_email_idx" ON "members"("email");

-- CreateIndex
CREATE INDEX "members_role_idx" ON "members"("role");

-- CreateIndex
CREATE INDEX "members_created_at_idx" ON "members"("created_at");

-- CreateIndex
CREATE INDEX "members_church_id_idx" ON "members"("church_id");

-- CreateIndex
CREATE INDEX "members_cell_id_idx" ON "members"("cell_id");

-- CreateIndex
CREATE INDEX "members_network_id_idx" ON "members"("network_id");

-- CreateIndex
CREATE INDEX "members_zone_id_idx" ON "members"("zone_id");

-- CreateIndex
CREATE INDEX "members_sector_id_idx" ON "members"("sector_id");

-- CreateIndex
CREATE INDEX "members_sub_sector_id_idx" ON "members"("sub_sector_id");

-- CreateIndex
CREATE INDEX "ministries_church_id_idx" ON "ministries"("church_id");

-- CreateIndex
CREATE INDEX "ministries_leader_id_idx" ON "ministries"("leader_id");

-- CreateIndex
CREATE UNIQUE INDEX "ministries_name_church_id_key" ON "ministries"("name", "church_id");

-- CreateIndex
CREATE UNIQUE INDEX "Cells_accessCode_key" ON "Cells"("accessCode");

-- CreateIndex
CREATE INDEX "Cells_church_id_idx" ON "Cells"("church_id");

-- CreateIndex
CREATE INDEX "Cells_sub_sector_id_idx" ON "Cells"("sub_sector_id");

-- CreateIndex
CREATE INDEX "Cells_leader_id_idx" ON "Cells"("leader_id");

-- CreateIndex
CREATE INDEX "Cells_host_id_idx" ON "Cells"("host_id");

-- CreateIndex
CREATE INDEX "zones_church_id_idx" ON "zones"("church_id");

-- CreateIndex
CREATE INDEX "zones_supervisor_id_idx" ON "zones"("supervisor_id");

-- CreateIndex
CREATE INDEX "sectors_church_id_idx" ON "sectors"("church_id");

-- CreateIndex
CREATE INDEX "sectors_zone_id_idx" ON "sectors"("zone_id");

-- CreateIndex
CREATE INDEX "sectors_supervisor_id_idx" ON "sectors"("supervisor_id");

-- CreateIndex
CREATE INDEX "sub_sectors_sector_id_idx" ON "sub_sectors"("sector_id");

-- CreateIndex
CREATE INDEX "sub_sectors_supervisor_id_idx" ON "sub_sectors"("supervisor_id");

-- CreateIndex
CREATE INDEX "groups_church_id_idx" ON "groups"("church_id");

-- CreateIndex
CREATE INDEX "groups_leader_id_idx" ON "groups"("leader_id");

-- CreateIndex
CREATE INDEX "groups_parent_id_idx" ON "groups"("parent_id");

-- CreateIndex
CREATE INDEX "group_fields_group_id_idx" ON "group_fields"("group_id");

-- CreateIndex
CREATE UNIQUE INDEX "group_fields_group_id_key_key" ON "group_fields"("group_id", "key");

-- CreateIndex
CREATE INDEX "cell_goals_church_id_idx" ON "cell_goals"("church_id");

-- CreateIndex
CREATE INDEX "cell_goals_cell_id_idx" ON "cell_goals"("cell_id");

-- CreateIndex
CREATE INDEX "cell_goals_event_id_idx" ON "cell_goals"("event_id");

-- CreateIndex
CREATE UNIQUE INDEX "cell_goals_cell_id_event_id_key" ON "cell_goals"("cell_id", "event_id");

-- CreateIndex
CREATE UNIQUE INDEX "reports_publicToken_key" ON "reports"("publicToken");

-- CreateIndex
CREATE INDEX "reports_church_id_idx" ON "reports"("church_id");

-- CreateIndex
CREATE INDEX "reports_cell_id_idx" ON "reports"("cell_id");

-- CreateIndex
CREATE INDEX "reports_group_id_idx" ON "reports"("group_id");

-- CreateIndex
CREATE INDEX "reports_sector_id_idx" ON "reports"("sector_id");

-- CreateIndex
CREATE INDEX "reports_sub_sector_id_idx" ON "reports"("sub_sector_id");

-- CreateIndex
CREATE INDEX "reports_zone_id_idx" ON "reports"("zone_id");

-- CreateIndex
CREATE UNIQUE INDEX "reports_church_id_slug_key" ON "reports"("church_id", "slug");

-- CreateIndex
CREATE INDEX "report_fields_report_id_idx" ON "report_fields"("report_id");

-- CreateIndex
CREATE UNIQUE INDEX "report_fields_report_id_key_key" ON "report_fields"("report_id", "key");

-- CreateIndex
CREATE INDEX "report_entries_church_id_idx" ON "report_entries"("church_id");

-- CreateIndex
CREATE INDEX "report_entries_report_id_idx" ON "report_entries"("report_id");

-- CreateIndex
CREATE INDEX "report_entries_cell_id_idx" ON "report_entries"("cell_id");

-- CreateIndex
CREATE INDEX "report_entries_group_id_idx" ON "report_entries"("group_id");

-- CreateIndex
CREATE INDEX "report_entries_sector_id_idx" ON "report_entries"("sector_id");

-- CreateIndex
CREATE INDEX "report_entries_sub_sector_id_idx" ON "report_entries"("sub_sector_id");

-- CreateIndex
CREATE INDEX "report_entries_zone_id_idx" ON "report_entries"("zone_id");

-- CreateIndex
CREATE INDEX "report_entry_values_entry_id_idx" ON "report_entry_values"("entry_id");

-- CreateIndex
CREATE INDEX "report_entry_values_report_field_id_idx" ON "report_entry_values"("report_field_id");

-- CreateIndex
CREATE INDEX "member_ministries_church_id_idx" ON "member_ministries"("church_id");

-- CreateIndex
CREATE UNIQUE INDEX "member_ministries_member_id_ministry_id_key" ON "member_ministries"("member_id", "ministry_id");

-- CreateIndex
CREATE INDEX "friends_church_id_idx" ON "friends"("church_id");

-- CreateIndex
CREATE INDEX "friends_cell_id_idx" ON "friends"("cell_id");

-- CreateIndex
CREATE INDEX "friends_invited_by_id_idx" ON "friends"("invited_by_id");

-- CreateIndex
CREATE INDEX "friends_spiritual_father_id_idx" ON "friends"("spiritual_father_id");

-- CreateIndex
CREATE INDEX "events_church_id_idx" ON "events"("church_id");

-- CreateIndex
CREATE INDEX "events_phase_id_idx" ON "events"("phase_id");

-- CreateIndex
CREATE INDEX "event_attendances_church_id_idx" ON "event_attendances"("church_id");

-- CreateIndex
CREATE INDEX "event_attendances_friend_id_idx" ON "event_attendances"("friend_id");

-- CreateIndex
CREATE INDEX "event_attendances_event_id_idx" ON "event_attendances"("event_id");

-- CreateIndex
CREATE UNIQUE INDEX "event_attendances_friend_id_event_id_key" ON "event_attendances"("friend_id", "event_id");

-- CreateIndex
CREATE INDEX "event_phases_church_id_idx" ON "event_phases"("church_id");

-- CreateIndex
CREATE INDEX "_MemberGroup_B_index" ON "_MemberGroup"("B");

-- AddForeignKey
ALTER TABLE "churches" ADD CONSTRAINT "churches_type_id_fkey" FOREIGN KEY ("type_id") REFERENCES "church_types"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "church_admins" ADD CONSTRAINT "church_admins_church_id_fkey" FOREIGN KEY ("church_id") REFERENCES "churches"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "networks" ADD CONSTRAINT "networks_church_id_fkey" FOREIGN KEY ("church_id") REFERENCES "churches"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "members" ADD CONSTRAINT "members_church_id_fkey" FOREIGN KEY ("church_id") REFERENCES "churches"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "members" ADD CONSTRAINT "members_network_id_fkey" FOREIGN KEY ("network_id") REFERENCES "networks"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "members" ADD CONSTRAINT "members_cell_id_fkey" FOREIGN KEY ("cell_id") REFERENCES "Cells"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "members" ADD CONSTRAINT "members_zone_id_fkey" FOREIGN KEY ("zone_id") REFERENCES "zones"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "members" ADD CONSTRAINT "members_sector_id_fkey" FOREIGN KEY ("sector_id") REFERENCES "sectors"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "members" ADD CONSTRAINT "members_sub_sector_id_fkey" FOREIGN KEY ("sub_sector_id") REFERENCES "sub_sectors"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ministries" ADD CONSTRAINT "ministries_church_id_fkey" FOREIGN KEY ("church_id") REFERENCES "churches"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ministries" ADD CONSTRAINT "ministries_leader_id_fkey" FOREIGN KEY ("leader_id") REFERENCES "members"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Cells" ADD CONSTRAINT "Cells_church_id_fkey" FOREIGN KEY ("church_id") REFERENCES "churches"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Cells" ADD CONSTRAINT "Cells_sub_sector_id_fkey" FOREIGN KEY ("sub_sector_id") REFERENCES "sub_sectors"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Cells" ADD CONSTRAINT "Cells_leader_id_fkey" FOREIGN KEY ("leader_id") REFERENCES "members"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Cells" ADD CONSTRAINT "Cells_host_id_fkey" FOREIGN KEY ("host_id") REFERENCES "members"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Cells" ADD CONSTRAINT "Cells_assistant_id_fkey" FOREIGN KEY ("assistant_id") REFERENCES "members"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "zones" ADD CONSTRAINT "zones_church_id_fkey" FOREIGN KEY ("church_id") REFERENCES "churches"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "zones" ADD CONSTRAINT "zones_supervisor_id_fkey" FOREIGN KEY ("supervisor_id") REFERENCES "members"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sectors" ADD CONSTRAINT "sectors_church_id_fkey" FOREIGN KEY ("church_id") REFERENCES "churches"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sectors" ADD CONSTRAINT "sectors_zone_id_fkey" FOREIGN KEY ("zone_id") REFERENCES "zones"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sectors" ADD CONSTRAINT "sectors_supervisor_id_fkey" FOREIGN KEY ("supervisor_id") REFERENCES "members"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sub_sectors" ADD CONSTRAINT "sub_sectors_sector_id_fkey" FOREIGN KEY ("sector_id") REFERENCES "sectors"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sub_sectors" ADD CONSTRAINT "sub_sectors_supervisor_id_fkey" FOREIGN KEY ("supervisor_id") REFERENCES "members"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "groups" ADD CONSTRAINT "groups_leader_id_fkey" FOREIGN KEY ("leader_id") REFERENCES "members"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "groups" ADD CONSTRAINT "groups_church_id_fkey" FOREIGN KEY ("church_id") REFERENCES "churches"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "groups" ADD CONSTRAINT "groups_parent_id_fkey" FOREIGN KEY ("parent_id") REFERENCES "groups"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "group_fields" ADD CONSTRAINT "group_fields_group_id_fkey" FOREIGN KEY ("group_id") REFERENCES "groups"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cell_goals" ADD CONSTRAINT "cell_goals_church_id_fkey" FOREIGN KEY ("church_id") REFERENCES "churches"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cell_goals" ADD CONSTRAINT "cell_goals_cell_id_fkey" FOREIGN KEY ("cell_id") REFERENCES "Cells"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cell_goals" ADD CONSTRAINT "cell_goals_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "events"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reports" ADD CONSTRAINT "reports_church_id_fkey" FOREIGN KEY ("church_id") REFERENCES "churches"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reports" ADD CONSTRAINT "reports_cell_id_fkey" FOREIGN KEY ("cell_id") REFERENCES "Cells"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reports" ADD CONSTRAINT "reports_group_id_fkey" FOREIGN KEY ("group_id") REFERENCES "groups"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reports" ADD CONSTRAINT "reports_sector_id_fkey" FOREIGN KEY ("sector_id") REFERENCES "sectors"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reports" ADD CONSTRAINT "reports_sub_sector_id_fkey" FOREIGN KEY ("sub_sector_id") REFERENCES "sub_sectors"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reports" ADD CONSTRAINT "reports_zone_id_fkey" FOREIGN KEY ("zone_id") REFERENCES "zones"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "report_fields" ADD CONSTRAINT "report_fields_report_id_fkey" FOREIGN KEY ("report_id") REFERENCES "reports"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "report_entries" ADD CONSTRAINT "report_entries_church_id_fkey" FOREIGN KEY ("church_id") REFERENCES "churches"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "report_entries" ADD CONSTRAINT "report_entries_report_id_fkey" FOREIGN KEY ("report_id") REFERENCES "reports"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "report_entries" ADD CONSTRAINT "report_entries_cell_id_fkey" FOREIGN KEY ("cell_id") REFERENCES "Cells"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "report_entries" ADD CONSTRAINT "report_entries_group_id_fkey" FOREIGN KEY ("group_id") REFERENCES "groups"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "report_entries" ADD CONSTRAINT "report_entries_sector_id_fkey" FOREIGN KEY ("sector_id") REFERENCES "sectors"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "report_entries" ADD CONSTRAINT "report_entries_sub_sector_id_fkey" FOREIGN KEY ("sub_sector_id") REFERENCES "sub_sectors"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "report_entries" ADD CONSTRAINT "report_entries_zone_id_fkey" FOREIGN KEY ("zone_id") REFERENCES "zones"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "report_entry_values" ADD CONSTRAINT "report_entry_values_entry_id_fkey" FOREIGN KEY ("entry_id") REFERENCES "report_entries"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "report_entry_values" ADD CONSTRAINT "report_entry_values_report_field_id_fkey" FOREIGN KEY ("report_field_id") REFERENCES "report_fields"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "member_ministries" ADD CONSTRAINT "member_ministries_church_id_fkey" FOREIGN KEY ("church_id") REFERENCES "churches"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "member_ministries" ADD CONSTRAINT "member_ministries_member_id_fkey" FOREIGN KEY ("member_id") REFERENCES "members"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "member_ministries" ADD CONSTRAINT "member_ministries_ministry_id_fkey" FOREIGN KEY ("ministry_id") REFERENCES "ministries"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "friends" ADD CONSTRAINT "friends_church_id_fkey" FOREIGN KEY ("church_id") REFERENCES "churches"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "friends" ADD CONSTRAINT "friends_cell_id_fkey" FOREIGN KEY ("cell_id") REFERENCES "Cells"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "friends" ADD CONSTRAINT "friends_invited_by_id_fkey" FOREIGN KEY ("invited_by_id") REFERENCES "members"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "friends" ADD CONSTRAINT "friends_spiritual_father_id_fkey" FOREIGN KEY ("spiritual_father_id") REFERENCES "members"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "events" ADD CONSTRAINT "events_church_id_fkey" FOREIGN KEY ("church_id") REFERENCES "churches"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "events" ADD CONSTRAINT "events_phase_id_fkey" FOREIGN KEY ("phase_id") REFERENCES "event_phases"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "event_attendances" ADD CONSTRAINT "event_attendances_church_id_fkey" FOREIGN KEY ("church_id") REFERENCES "churches"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "event_attendances" ADD CONSTRAINT "event_attendances_friend_id_fkey" FOREIGN KEY ("friend_id") REFERENCES "friends"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "event_attendances" ADD CONSTRAINT "event_attendances_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "events"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "event_phases" ADD CONSTRAINT "event_phases_church_id_fkey" FOREIGN KEY ("church_id") REFERENCES "churches"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_MemberGroup" ADD CONSTRAINT "_MemberGroup_A_fkey" FOREIGN KEY ("A") REFERENCES "groups"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_MemberGroup" ADD CONSTRAINT "_MemberGroup_B_fkey" FOREIGN KEY ("B") REFERENCES "members"("id") ON DELETE CASCADE ON UPDATE CASCADE;
