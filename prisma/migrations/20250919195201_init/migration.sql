-- CreateEnum
CREATE TYPE "public"."member_role" AS ENUM ('MIEMBRO', 'SUPERVISOR', 'LIDER', 'ANFITRION');

-- CreateEnum
CREATE TYPE "public"."gender" AS ENUM ('MASCULINO', 'FEMENINO');

-- CreateTable
CREATE TABLE "public"."churches" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "churches_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."members" (
    "id" TEXT NOT NULL,
    "first_name" TEXT NOT NULL,
    "last_name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "age" INTEGER,
    "street" TEXT,
    "city" TEXT,
    "state" TEXT,
    "zip" TEXT,
    "country" TEXT DEFAULT 'México',
    "birth_date" TIMESTAMP(3),
    "baptism_date" TIMESTAMP(3),
    "role" "public"."member_role" NOT NULL DEFAULT 'MIEMBRO',
    "gender" "public"."gender" NOT NULL,
    "ministerio" TEXT NOT NULL DEFAULT 'General',
    "picture_url" TEXT,
    "notes" TEXT,
    "skills" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "password_hash" TEXT,
    "church_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "members_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "churches_slug_key" ON "public"."churches"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "members_email_key" ON "public"."members"("email");

-- CreateIndex
CREATE INDEX "members_church_id_idx" ON "public"."members"("church_id");

-- CreateIndex
CREATE INDEX "members_email_idx" ON "public"."members"("email");

-- CreateIndex
CREATE INDEX "members_role_idx" ON "public"."members"("role");

-- CreateIndex
CREATE INDEX "members_created_at_idx" ON "public"."members"("created_at");

-- AddForeignKey
ALTER TABLE "public"."members" ADD CONSTRAINT "members_church_id_fkey" FOREIGN KEY ("church_id") REFERENCES "public"."churches"("id") ON DELETE CASCADE ON UPDATE CASCADE;
