import { PrismaClient } from '../generated/prisma/index.js';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  await prisma.$transaction(async (tx) => {
    await tx.saleItem.deleteMany();
    await tx.document.deleteMany();
    await tx.activity.deleteMany();
    await tx.note.deleteMany();
    await tx.sale.deleteMany();
    await tx.task.deleteMany();
    await tx.ticket.deleteMany();
    await tx.opportunity.deleteMany();
    await tx.lead.deleteMany();
    await tx.campaign.deleteMany();
    await tx.contact.deleteMany();
    await tx.customer.deleteMany();
    await tx.product.deleteMany();
    await tx.dashboard.deleteMany();
    await tx.user.deleteMany();

    const hashedPassword = await bcrypt.hash('password123', 10);

    const admin = await tx.user.create({
      data: {
        username: 'admin',
        email: 'admin@crm.com',
        password: hashedPassword,
        role: 'ADMIN',
      },
    });

    const manager = await tx.user.create({
      data: {
        username: 'manager',
        email: 'manager@crm.com',
        password: hashedPassword,
        role: 'MANAGER',
      },
    });

    const salesUser = await tx.user.create({
      data: {
        username: 'sales',
        email: 'sales@crm.com',
        password: hashedPassword,
        role: 'SALES',
      },
    });

    const users = [admin, manager, salesUser];
    for (const user of users) {
      await tx.dashboard.create({
        data: {
          name: `${user.username}'s Dashboard`,
          layout: {},
          userId: user.id,
        },
      });
    }

    const product1 = await tx.product.create({
      data: {
        name: 'Lisensi Software Pro',
        price: 5000000,
        description: 'Lisensi tahunan untuk software Pro.',
        createdByUserId: admin.id,
      },
    });

    const product2 = await tx.product.create({
      data: {
        name: 'Paket Konsultasi Basic',
        price: 2500000,
        description: '10 jam konsultasi basic.',
        createdByUserId: admin.id,
      },
    });

    const customer1 = await tx.customer.create({
      data: {
        name: 'PT Teknologi Nusantara',
        email: 'contact@nusantara.com',
        phone: '081234567890',
        company: 'Nusantara Group',
        createdByUserId: salesUser.id,
      },
    });

    await tx.contact.create({
      data: {
        firstName: 'Budi',
        lastName: 'Santoso',
        email: 'budi.s@nusantara.com',
        phone: '081234567891',
        position: 'IT Manager',
        customerId: customer1.id,
        createdByUserId: salesUser.id,
      },
    });

    const lead1 = await tx.lead.create({
      data: {
        name: 'Proyek Website Baru - PT Sejahtera',
        email: 'info@sejahtera.com',
        phone: '089876543210',
        status: 'NEW',
        createdByUserId: salesUser.id,
      },
    });

    const opportunity1 = await tx.opportunity.create({
      data: {
        name: 'Peluang dari PT Teknologi Nusantara',
        amount: 7500000,
        stage: 'PROPOSAL_PRESENTATION',
        closeDate: new Date(),
        customerId: customer1.id,
        createdByUserId: salesUser.id,
      },
    });

    const sale1 = await tx.sale.create({
      data: {
        customerId: customer1.id,
        opportunityId: opportunity1.id,
        totalAmount: 7500000,
        status: 'COMPLETED',
        createdByUserId: salesUser.id,
      },
    });

    await tx.saleItem.create({
      data: {
        saleId: sale1.id,
        productId: product1.id,
        quantity: 1,
        unitPrice: product1.price,
      },
    });

    await tx.saleItem.create({
      data: {
        saleId: sale1.id,
        productId: product2.id,
        quantity: 1,
        unitPrice: product2.price,
      },
    });

    await tx.task.create({
      data: {
        name: 'Follow up proposal PT Teknologi Nusantara',
        description: 'Hubungi Budi Santoso untuk follow up proposal yang dikirim minggu lalu.',
        status: 'PENDING',
        priority: 'HIGH',
        dueDate: new Date(),
        assignedToUserId: salesUser.id,
        createdByUserId: manager.id,
        opportunityId: opportunity1.id,
      },
    });

    await tx.activity.create({
      data: {
        type: 'EMAIL',
        subject: 'Proposal Penawaran Software CRM',
        content: 'Proposal telah dikirimkan ke Budi Santoso.',
        createdByUserId: salesUser.id,
        opportunityId: opportunity1.id,
      },
    });

    await tx.note.create({
      data: {
        content: 'Budi Santoso meminta diskon 10% untuk paket konsultasi.',
        createdByUserId: salesUser.id,
        opportunityId: opportunity1.id,
      },
    });

    await tx.campaign.create({
      data: {
        name: 'Diskon Akhir Tahun 2025',
        type: 'EMAIL',
        status: 'ACTIVE',
        startDate: new Date(),
        endDate: new Date(new Date().setDate(new Date().getDate() + 30)),
        budget: 10000000,
        createdByUserId: manager.id,
      },
    });

    await tx.ticket.create({
        data: {
            subject: 'Tidak bisa login ke sistem',
            description: 'Salah satu user kami, Budi Santoso, tidak bisa login.',
            status: 'OPEN',
            customerId: customer1.id,
            assignedToUserId: manager.id,
            createdByUserId: admin.id,
        }
    });

  });
}

main()
  .then(async () => {
    console.log('Database seeding completed successfully.');
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error('Error during database seeding:', e);
    await prisma.$disconnect();
    process.exit(1);
  });