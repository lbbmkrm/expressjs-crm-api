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

  await prisma.user.createMany({
    data: [
      {
        username: "sales2user",
        email: "sales2@example.com",
        password: hashPassword,
        role: "SALES",
      },
      {
        username: "manageruser",
        email: "manager@example.com",
        password: hashPassword,
        role: "MANAGER",
      },
      {
        username: "vieweruser",
        email: "viewer@example.com",
        password: hashPassword,
        role: "VIEWER",
      },
    ],
  });

  // Simpan id semua data untuk referensi
  const customers = [];
  const contacts = [];
  const leads = [];
  const opportunities = [];

  // Buat 5 Customer
  for (let i = 1; i <= 5; i++) {
    const customer = await prisma.customer.create({
      data: {
        name: `PT. Contoh ${i}`,
        email: `contact${i}@ptcontoh.com`,
        phone: `0812345678${i}`,
        address: `Jl. Contoh No.${i}`,
        company: `Contoh Group ${i}`,
        createdByUserId: adminUser.id,
      },
    });
    customers.push(customer);
  }

  // Buat 5 Contact
  for (let i = 0; i < 5; i++) {
    const contact = await prisma.contact.create({
      data: {
        customerId: customers[i].id,
        firstName: `Contact${i}`,
        lastName: `Last${i}`,
        email: `contact${i}@example.com`,
        phone: `0898765432${i}`,
        position: `Manager ${i}`,
        createdByUserId: salesUser.id,
      },
    });
    contacts.push(contact);
  }

  // Buat 5 Lead
  for (let i = 0; i < 5; i++) {
    const lead = await prisma.lead.create({
      data: {
        name: `Lead ${i}`,
        email: `lead${i}@example.com`,
        phone: `0877123456${i}`,
        status: LeadStatus.NEW,
        createdByUserId: salesUser.id,
        customerId: customers[i].id,
      },
    });
    leads.push(lead);
  }

  // Buat 5 Opportunity
  for (let i = 0; i < 5; i++) {
    const opportunity = await prisma.opportunity.create({
      data: {
        name: `Opportunity ${i}`,
        amount: 10000000 + i * 1000000,
        stage: OpportunityStage.QUALIFICATION,
        closeDate: new Date(Date.now() + i * 5 * 24 * 60 * 60 * 1000),
        description: `Deskripsi proyek ${i}`,
        customerId: customers[i].id,
        leadId: leads[i].id,
        createdByUserId: salesUser.id,
      },
    });
    opportunities.push(opportunity);
  }

  // Buat 5 Task
  for (let i = 0; i < 5; i++) {
    await prisma.task.create({
      data: {
        name: `Task ${i}`,
        description: `Kerjakan task nomor ${i}`,
        status: TaskStatus.PENDING,
        priority: TaskPriority.HIGH,
        dueDate: new Date(Date.now() + i * 3 * 24 * 60 * 60 * 1000),
        customerId: customers[i].id,
        leadId: leads[i].id,
        opportunityId: opportunities[i].id,
        assignedToUserId: salesUser.id,
        createdByUserId: adminUser.id,
      },
    });
  }

  // Buat 5 Note
  for (let i = 0; i < 5; i++) {
    await prisma.note.create({
      data: {
        content: `Catatan ke-${i} untuk proyek`,
        customerId: customers[i].id,
        contactId: contacts[i].id,
        leadId: leads[i].id,
        opportunityId: opportunities[i].id,
        createdByUserId: salesUser.id,
      },
    });
  }

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
