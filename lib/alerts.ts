import { prisma } from "@/lib/prisma";

export interface OverdueAlertResult {
  count: number;
  articleIds: string[];
}

export async function checkAndFlagOverdueArticles(): Promise<OverdueAlertResult> {
  const now = new Date();

  const overdueArticles = await prisma.article.findMany({
    where: {
      status: "SCHEDULED",
      publishTime: {
        lt: now,
      },
    },
    select: {
      id: true,
    },
  });

  const articleIds = overdueArticles.map((article) => article.id);

  if (articleIds.length > 0) {
    await prisma.article.updateMany({
      where: {
        id: { in: articleIds },
      },
      data: {
        status: "PUBLISHED",
      },
    });
  }

  return {
    count: articleIds.length,
    articleIds,
  };
}