-- AlterTable
ALTER TABLE "documents" ADD COLUMN     "activity_id" INTEGER,
ADD COLUMN     "ticket_id" INTEGER;

-- AddForeignKey
ALTER TABLE "documents" ADD CONSTRAINT "documents_ticket_id_fkey" FOREIGN KEY ("ticket_id") REFERENCES "tickets"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "documents" ADD CONSTRAINT "documents_activity_id_fkey" FOREIGN KEY ("activity_id") REFERENCES "activities"("id") ON DELETE SET NULL ON UPDATE CASCADE;
