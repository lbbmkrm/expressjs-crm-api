import { PrismaClient, Roles } from "../generated/prisma/index.js";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

// Helper function to get a random item from an array
const getRandomItem = (arr) => arr[Math.floor(Math.random() * arr.length)];

async function main() {
  console.log("🧹 Starting seeder cleanup...");

  // Clean up database in the correct order to avoid foreign key constraint errors
  await prisma.saleItem.deleteMany();
  await prisma.sale.deleteMany();
  await prisma.activity.deleteMany();
  await prisma.note.deleteMany();
  await prisma.task.deleteMany();
  await prisma.opportunity.deleteMany();
  await prisma.lead.deleteMany();
  await prisma.contact.deleteMany();
  await prisma.customer.deleteMany();
  await prisma.product.deleteMany();
  await prisma.dashboard.deleteMany();
  await prisma.user.deleteMany();

  console.log("✅ Cleanup complete.");
  console.log("🌱 Starting seeding process...");

  // --- 1. Create Users ---
  const password = "password123";
  const hashedPassword = await bcrypt.hash(password, 10);

  const usersData = [
    { username: "admin", email: "admin@crm.com", role: Roles.ADMIN },
    { username: "manager", email: "manager@crm.com", role: Roles.MANAGER },
    { username: "sales1", email: "sales1@crm.com", role: Roles.SALES },
    { username: "sales2", email: "sales2@crm.com", role: Roles.SALES },
    { username: "viewer", email: "viewer@crm.com", role: Roles.VIEWER },
  ];

  const createdUsers = [];
  for (const u of usersData) {
    const user = await prisma.user.create({
      data: { ...u, password: hashedPassword },
    });
    createdUsers.push(user);
    console.log(`- Created User: ${user.username}`);
  }
  const adminUser = createdUsers.find((u) => u.role === "ADMIN");
  const salesUsers = createdUsers.filter((u) => u.role === "SALES");

  // --- 2. Create Dashboards for each User ---
  for (const user of createdUsers) {
    await prisma.dashboard.create({
      data: {
        name: `${user.username}'s Dashboard`,
        description: `Default dashboard for ${user.username}`,
        layout: {
          widgets: [
            { id: "welcome", type: "text", content: "Welcome to your dashboard!" },
            { id: "sales_overview", type: "chart", chartType: "bar" },
            { id: "task_list", type: "list" },
          ],
        },
        userId: user.id,
      },
    });
    console.log(`- Created Dashboard for ${user.username}`);
  }

  // --- 3. Create Products ---
  const productsData = [
    { name: "Lisensi Software Pro", price: 5000000, description: "Lisensi tahunan untuk software Pro." },
    { name: "Paket Konsultasi Basic", price: 2500000, description: "10 jam konsultasi basic." },
    { name: "Layanan Maintenance Tahunan", price: 1500000, description: "Maintenance server dan aplikasi." },
    { name: "Modul Tambahan CRM", price: 2000000, description: "Modul analytics untuk CRM." },
    { name: "Training Pengguna (per sesi)", price: 750000, description: "Sesi training untuk tim." },
  ];
  const createdProducts = [];
  for (const p of productsData) {
    const product = await prisma.product.create({ data: p });
    createdProducts.push(product);
  }
  console.log(`- Created ${createdProducts.length} Products`);

  // --- 4. Create Customers & Contacts ---
  const customersData = [
    { name: "PT Teknologi Nusantara", company: "Nusantara Group", address: "Jl. Sudirman No. 1, Jakarta" },
    { name: "CV Solusi Digital", company: "Solusi Group", address: "Jl. Gatot Subroto No. 2, Bandung" },
    { name: "PT Inovasi Cipta Karya", company: "Inovasi Corp", address: "Jl. Thamrin No. 3, Surabaya" },
    { name: "UD Maju Jaya", company: "Maju Jaya", address: "Jl. Merdeka No. 4, Medan" },
    { name: "PT Sinar Harapan", company: "Sinar Corp", address: "Jl. Diponegoro No. 5, Makassar" },
  ];
  const createdCustomers = [];
  const createdContacts = [];

  for (const c of customersData) {
    const customer = await prisma.customer.create({
      data: {
        ...c,
        email: `contact@${c.name.toLowerCase().replace(/\s/g, '')}.com`,
        phone: `0812${Math.floor(10000000 + Math.random() * 90000000)}`,
        createdByUserId: getRandomItem(salesUsers).id,
      },
    });
    createdCustomers.push(customer);

    const contact = await prisma.contact.create({
        data: {
            customerId: customer.id,
            firstName: `Budi`,
            lastName: `${c.name.split(' ')[1]}`,
            email: `budi@${c.name.toLowerCase().replace(/\s/g, '')}.com`,
            phone: `0813${Math.floor(10000000 + Math.random() * 90000000)}`,
            position: 'Manager IT',
            createdByUserId: customer.createdByUserId
        }
    });
    createdContacts.push(contact);
  }
  console.log(`- Created ${createdCustomers.length} Customers and Contacts`);

  // --- 5. Create Leads -> Opportunities -> Sales ---
  const leadsData = [
    { name: "Proyek Website Baru - PT Sejahtera", status: "CONVERTED" },
    { name: "Integrasi API - CV Makmur", status: "CONVERTED" },
    { name: "Pengadaan Software HR - PT Bahagia", status: "LOST" },
    { name: "Konsultasi Digital Marketing - UD Sentosa", status: "CONTACTED" },
    { name: "Training Tim Sales - PT Abadi", status: "NEW" },
  ];
  
  for (const l of leadsData) {
    const assignedUser = getRandomItem(salesUsers);
    const customer = getRandomItem(createdCustomers);

    const lead = await prisma.lead.create({
      data: {
        ...l,
        email: `${l.name.split(' ')[0].toLowerCase()}@example.com`,
        phone: `0857${Math.floor(10000000 + Math.random() * 90000000)}`,
        createdByUserId: assignedUser.id,
        customerId: customer.id,
      },
    });
    console.log(`- Created Lead: ${lead.name}`);

    // Create an activity for the new lead
    await prisma.activity.create({
        data: {
            type: 'NOTE',
            subject: 'Lead Dibuat',
            content: `Lead baru "${lead.name}" telah dibuat dan ditugaskan kepada ${assignedUser.username}.`,
            leadId: lead.id,
            createdByUserId: adminUser.id,
        }
    });

    if (lead.status === "CONVERTED" || lead.status === "LOST") {
      const stage = lead.status === "CONVERTED" ? "WON" : "LOST";
      const opportunity = await prisma.opportunity.create({
        data: {
          name: `Peluang dari ${lead.name}`,
          amount: Math.floor(5 + Math.random() * 50) * 1000000,
          stage: stage,
          closeDate: new Date(),
          description: `Peluang yang dikonversi dari lead ${lead.name}`,
          customerId: customer.id,
          leadId: lead.id,
          createdByUserId: assignedUser.id,
        },
      });
      console.log(`-- Converted to Opportunity: ${opportunity.name} (${opportunity.stage})`);

      if (opportunity.stage === "WON") {
        const saleItems = [
            { productId: createdProducts[0].id, quantity: 1, unitPrice: createdProducts[0].price },
            { productId: createdProducts[2].id, quantity: 1, unitPrice: createdProducts[2].price },
        ];
        const totalAmount = saleItems.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0);

        await prisma.sale.create({
            data: {
                customerId: opportunity.customerId,
                opportunityId: opportunity.id,
                totalAmount: totalAmount,
                status: 'COMPLETED',
                createdByUserId: opportunity.createdByUserId,
                items: {
                    create: saleItems
                }
            }
        });
        console.log(`--- Created Sale for Opportunity: ${opportunity.name}`);
      }
    }
  }

  // --- 6. Create some standalone Tasks and Notes ---
  await prisma.task.create({
    data: {
        name: 'Follow up dengan semua lead baru',
        description: 'Hubungi semua lead yang statusnya masih NEW minggu ini.',
        status: 'PENDING',
        priority: 'HIGH',
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // Due in 7 days
        assignedToUserId: createdUsers.find(u => u.role === 'MANAGER').id,
        createdByUserId: adminUser.id,
    }
  });
  await prisma.note.create({
    data: {
        content: 'Meeting Q3 akan diadakan pada akhir bulan. Siapkan laporan penjualan.',
        customerId: createdCustomers[0].id,
        createdByUserId: adminUser.id,
    }
  });
  console.log(`- Created additional Tasks and Notes.`);

  console.log("✅ Seeding finished successfully!");
}

main()
  .catch((e) => {
    console.error("❌ An error occurred during seeding:");
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });