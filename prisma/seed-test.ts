import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Clean existing test data
  await prisma.examAttempt.deleteMany({
    where: {
      user: {
        email: { in: ["testemployee@bacancy.com", "testadmin@bacancy.com"] },
      },
    },
  });

  // Create/update dummy employee
  const employee = await prisma.user.upsert({
    where: { email: "testemployee@bacancy.com" },
    update: { name: "Test Employee", role: "USER" },
    create: {
      email: "testemployee@bacancy.com",
      name: "Test Employee",
      role: "USER",
    },
  });

  // Create/update dummy admin
  const admin = await prisma.user.upsert({
    where: { email: "testadmin@bacancy.com" },
    update: { name: "Test Admin", role: "ADMIN" },
    create: {
      email: "testadmin@bacancy.com",
      name: "Test Admin",
      role: "ADMIN",
    },
  });

  // Ensure exam is open for testing
  await prisma.examConfig.upsert({
    where: { id: "singleton" },
    update: { examOpen: true },
    create: { id: "singleton", examOpen: true },
  });

  console.log("Test seed complete:");
  console.log("  Employee:", employee.id, employee.email);
  console.log("  Admin:", admin.id, admin.email);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
