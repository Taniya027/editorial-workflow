import { PrismaClient, Role, ArticleStatus } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  // Clear existing data safely
  await prisma.auditLog.deleteMany();
  await prisma.article.deleteMany();
  await prisma.sectionAssignment.deleteMany();
  await prisma.section.deleteMany();
  await prisma.user.deleteMany();

  const hashedPassword = await bcrypt.hash("password123", 10);

  // Create Editor
  const editor = await prisma.user.create({
    data: {
      email: "editor@example.com",
      passwordHash: hashedPassword,
      role: Role.EDITOR,
    },
  });

  // Create Writer
  const writer = await prisma.user.create({
    data: {
      email: "writer@example.com",
      passwordHash: hashedPassword,
      role: Role.WRITER,
    },
  });

  // Create Sections
  const techSection = await prisma.section.create({
    data: {
      name: "Technology",
      description: "Software engineering, web3, and tech news.",
      ownerEditorId: editor.id,
    },
  });

  await prisma.section.create({
    data: {
      name: "Politics",
      description: "Global policy and governance updates.",
      ownerEditorId: editor.id,
    },
  });

  // Assign writer to Technology section using relation connect
  await prisma.sectionAssignment.create({
    data: {
      section: { connect: { id: techSection.id } },
      writer: { connect: { id: writer.id } },
    },
  });

  // Create sample articles
  await prisma.article.create({
    data: {
      title: "Understanding EVM Gas Optimization",
      body: "Gas optimization in Solidity smart contracts is crucial for reducing user transaction costs...",
      status: ArticleStatus.PUBLISHED,
      authorId: writer.id,
      sectionId: techSection.id,
      publishTime: new Date(Date.now() - 86400000 * 2),
    },
  });

  await prisma.article.create({
    data: {
      title: "Next.js App Router Architecture",
      body: "Server components and server actions simplify data flow in modern web apps...",
      status: ArticleStatus.IN_REVIEW,
      authorId: writer.id,
      sectionId: techSection.id,
    },
  });

  console.log("Seeding finished successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });