/*
  Warnings:

  - You are about to drop the column `documentType` on the `documents` table. All the data in the column will be lost.

*/
-- AlterEnum
ALTER TYPE "DocumentType" ADD VALUE 'ORDER';

-- AlterTable
ALTER TABLE "documents" DROP COLUMN "documentType",
ADD COLUMN     "campaign_id" INTEGER,
ADD COLUMN     "document_type" "DocumentType" NOT NULL DEFAULT 'OTHER';

-- AddForeignKey
ALTER TABLE "documents" ADD CONSTRAINT "documents_campaign_id_fkey" FOREIGN KEY ("campaign_id") REFERENCES "campaigns"("id") ON DELETE SET NULL ON UPDATE CASCADE;
