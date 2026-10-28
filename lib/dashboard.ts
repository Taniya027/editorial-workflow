import { prisma } from "@/lib/prisma";

export interface DashboardMetrics {
  totalArticles: number;
  statusBreakdown: {
    DRAFT: number;
    IN_REVIEW: number;
    APPROVED: number;
    SCHEDULED: number;
    PUBLISHED: number;
  };
  weeklyPublicationTrend: Array<{
    weekLabel: string;
    count: number;
  }>;
}

/**
 * Goal 8: Fetch dashboard headline metrics, status breakdown, and 8-week publication trend.
 */
export async function getDashboardMetrics(): Promise<DashboardMetrics> {
  // 1. Get counts grouped by status
  const groupedStatus = await prisma.article.groupBy({
    by: ["status"],
    _count: {
      id: true,
    },
  });

  const statusBreakdown = {
    DRAFT: 0,
    IN_REVIEW: 0,
    APPROVED: 0,
    SCHEDULED: 0,
    PUBLISHED: 0,
  };

  let totalArticles = 0;
  for (const item of groupedStatus) {
    statusBreakdown[item.status] = item._count.id;
    totalArticles += item._count.id;
  }

  // 2. Compute 8-Week Publication Trend
  const now = new Date();
  const eightWeeksAgo = new Date();
  eightWeeksAgo.setDate(now.getDate() - 56); // 8 weeks * 7 days

  const publishedOrScheduled = await prisma.article.findMany({
    where: {
      publishTime: {
        gte: eightWeeksAgo,
        lte: now,
      },
      status: { in: ["SCHEDULED", "PUBLISHED"] },
    },
    select: {
      publishTime: true,
    },
  });

  // Group into 8 weekly buckets
  const weeklyBuckets: Array<{ weekLabel: string; count: number; startDate: Date; endDate: Date }> = [];
  
  for (let i = 7; i >= 0; i--) {
    const start = new Date();
    start.setDate(now.getDate() - (i + 1) * 7);
    const end = new Date();
    end.setDate(now.getDate() - i * 7);

    const weekLabel = `${start.toLocaleDateString("en-US", { month: "short", day: "numeric" })} - ${end.toLocaleDateString("en-US", { month: "short", day: "numeric" })}`;
    
    weeklyBuckets.push({
      weekLabel,
      count: 0,
      startDate: start,
      endDate: end,
    });
  }

  for (const article of publishedOrScheduled) {
    if (!article.publishTime) continue;
    const pubTime = new Date(article.publishTime);

    for (const bucket of weeklyBuckets) {
      if (pubTime >= bucket.startDate && pubTime < bucket.endDate) {
        bucket.count++;
        break;
      }
    }
  }

  const weeklyPublicationTrend = weeklyBuckets.map(({ weekLabel, count }) => ({
    weekLabel,
    count,
  }));

  return {
    totalArticles,
    statusBreakdown,
    weeklyPublicationTrend,
  };
}