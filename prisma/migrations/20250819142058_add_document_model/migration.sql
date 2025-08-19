/*
  Warnings:

  - You are about to drop the column `deleted_at` on the `dashboards` table. All the data in the column will be lost.
  - You are about to drop the column `updated_at` on the `dashboards` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "DocumentType" AS ENUM ('PROPOSAL', 'INVOICE', 'QUOTE', 'CONTRACT', 'IMAGE', 'OTHER');

-- DropForeignKey
ALTER TABLE "dashboards" DROP CONSTRAINT "dashboards_user_id_fkey";

-- AlterTable
ALTER TABLE "dashboards" DROP COLUMN "deleted_at",
DROP COLUMN "updated_at";

-- CreateTable
CREATE TABLE "documents" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "path" VARCHAR(255) NOT NULL,
    "size" INTEGER NOT NULL,
    "file_type" VARCHAR(255) NOT NULL,
    "documentType" "DocumentType" NOT NULL DEFAULT 'OTHER',
    "created_by_user_id" INTEGER NOT NULL,
    "customer_id" INTEGER,
    "contact_id" INTEGER,
    "lead_id" INTEGER,
    "opportunity_id" INTEGER,
    "sale_id" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "documents_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "documents" ADD CONSTRAINT "documents_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "documents" ADD CONSTRAINT "documents_customer_id_fkey" FOREIGN KEY ("customer_id") REFERENCES "customers"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "documents" ADD CONSTRAINT "documents_contact_id_fkey" FOREIGN KEY ("contact_id") REFERENCES "contacts"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "documents" ADD CONSTRAINT "documents_lead_id_fkey" FOREIGN KEY ("lead_id") REFERENCES "leads"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "documents" ADD CONSTRAINT "documents_opportunity_id_fkey" FOREIGN KEY ("opportunity_id") REFERENCES "opportunities"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "documents" ADD CONSTRAINT "documents_sale_id_fkey" FOREIGN KEY ("sale_id") REFERENCES "sales"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "dashboards" ADD CONSTRAINT "dashboards_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
