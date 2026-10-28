import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    // Fetch all Scheduled or Published articles for the editorial calendar export
    const articles = await prisma.article.findMany({
      where: {
        status: { in: ["SCHEDULED", "PUBLISHED"] },
      },
      select: {
        id: true,
        title: true,
        status: true,
        publishTime: true,
        section: {
          select: { name: true },
        },
        author: {
          select: { email: true, name: true },
        },
      },
      orderBy: { publishTime: "asc" },
    });

    // Build CSV headers and rows
    const csvRows = [
      ["ID", "Title", "Status", "Section", "Author", "Publish Time"].join(","),
    ];

    for (const article of articles) {
      const authorName: string = article.author?.name || article.author?.email || "Unknown";
      const row = [
        article.id,
        `"${article.title.replace(/"/g, '""')}"`,
        article.status,
        `"${article.section.name.replace(/"/g, '""')}"`,
        `"${authorName.replace(/"/g, '""')}"`,
        article.publishTime ? article.publishTime.toISOString() : "",
      ];
      csvRows.push(row.join(","));
    }

    const csvString = csvRows.join("\n");

    return new NextResponse(csvString, {
      status: 200,
      headers: {
        "Content-Type": "text/csv",
        "Content-Disposition": 'attachment; filename="editorial-calendar.csv"',
      },
    });
  } catch {
    return NextResponse.json({ error: "Failed to export calendar" }, { status: 500 });
  }
}