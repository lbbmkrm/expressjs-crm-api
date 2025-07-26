import {
  PrismaClient,
  LeadStatus,
  OpportunityStage,
  TaskPriority,
  TaskStatus,
} from "../generated/prisma/index.js";
import bcrypt from "bcrypt";
const prisma = new PrismaClient();

async function main() {
  const hashPassword = await bcrypt.hash("password123", 10);
  // 1. Buat User
  const adminUser = await prisma.user.create({
    data: {
      username: "adminuser",
      email: "admin@example.com",
      password: hashPassword,
      role: "ADMIN",
    },
  });

  const salesUser = await prisma.user.create({
    data: {
      username: "salesuser",
      email: "sales@example.com",
      password: hashPassword,
      role: "SALES",
    },
  });

  // 2. Buat Customer
  const customer = await prisma.customer.create({
    data: {
      name: "PT. Nusantara Teknologi",
      email: "info@nusantaratech.id",
      phone: "08123456789",
      address: "Jl. Merdeka No. 1, Jakarta",
      company: "Nusantara Group",
      createdByUserId: adminUser.id,
    },
  });

  // 3. Buat Contact
  const contact = await prisma.contact.create({
    data: {
      customerId: customer.id,
      firstName: "Budi",
      lastName: "Santoso",
      email: "budi@nusantaratech.id",
      phone: "08129876543",
      position: "IT Manager",
      createdByUserId: salesUser.id,
    },
  });

  // 4. Buat Lead
  const lead = await prisma.lead.create({
    data: {
      name: "Prospek PT. Nusantara",
      email: "prospek@nusantaratech.id",
      phone: "082112345678",
      status: LeadStatus.NEW,
      createdByUserId: salesUser.id,
      customerId: customer.id,
    },
  });

  // 5. Buat Opportunity
  const opportunity = await prisma.opportunity.create({
    data: {
      name: "Proyek ERP Nusantara",
      amount: 25000000,
      stage: OpportunityStage.QUALIFICATION,
      closeDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      description: "Implementasi sistem ERP",
      customerId: customer.id,
      leadId: lead.id,
      createdByUserId: salesUser.id,
    },
  });

  // 6. Buat Task
  const task = await prisma.task.create({
    data: {
      name: "Follow up proposal",
      description: "Hubungi klien terkait proposal ERP",
      status: TaskStatus.PENDING,
      priority: TaskPriority.HIGH,
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 hari dari sekarang
      customerId: customer.id,
      leadId: lead.id,
      opportunityId: opportunity.id,
      assignedToUserId: salesUser.id,
      createdByUserId: adminUser.id,
    },
  });

  // 7. Buat Note
  const note = await prisma.note.create({
    data: {
      content: "Catatan awal untuk proyek ERP.",
      customerId: customer.id,
      contactId: contact.id,
      leadId: lead.id,
      opportunityId: opportunity.id,
      createdByUserId: salesUser.id,
    },
  });

  console.log("Seeder selesai ✅");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
