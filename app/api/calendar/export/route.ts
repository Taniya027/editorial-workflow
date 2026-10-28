import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const articles = await prisma.article.findMany({
      where: {
        status: {
          in: ["SCHEDULED", "PUBLISHED"],
        },
      },
      include: {
        author: true,
        section: true,
      },
      orderBy: {
        publishTime: "asc",
      },
    });

    const headers = ["ID", "Title", "Status", "Publish Time", "Author", "Section"];
    const rows = articles.map((art) => [
      art.id,
      `"${art.title.replace(/"/g, '""')}"`,
      art.status,
      art.publishTime ? art.publishTime.toISOString() : "",
      `"${(art.author?.email || art.authorId).replace(/"/g, '""')}"`,
      `"${(art.section?.name || art.sectionId).replace(/"/g, '""')}"`,
    ]);

    const csvContent = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");

    return new NextResponse(csvContent, {
      status: 200,
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": 'attachment; filename="editorial-calendar.csv"',
      },
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Internal Server Error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}