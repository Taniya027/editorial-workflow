"use server";

import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export interface BatchResultItem {
  id: string;
  success: boolean;
  message: string;
}

/**
 * Goal 7: Batch Schedule Articles
 */
export async function batchScheduleArticles(
  articleIds: string[],
  publishTime: string
): Promise<BatchResultItem[]> {
  const session = await getServerSession(authOptions);
  if (!session?.user) throw new Error("Unauthorized");
  const user = session.user as { role: string };

  if (user.role !== "EDITOR") {
    throw new Error("Only editors can perform batch scheduling.");
  }

  const results: BatchResultItem[] = [];
  const targetDate = new Date(publishTime);

  if (targetDate <= new Date()) {
    return articleIds.map((id) => ({
      id,
      success: false,
      message: "Publish time must be in the future.",
    }));
  }

  for (const id of articleIds) {
    try {
      const article = await prisma.article.findUnique({ where: { id } });
      if (!article) {
        results.push({ id, success: false, message: "Article not found." });
        continue;
      }

      // Can only schedule from APPROVED or SCHEDULED
      if (article.status !== "APPROVED" && article.status !== "SCHEDULED") {
        results.push({
          id,
          success: false,
          message: `Cannot schedule article in ${article.status} status. Must be Approved.`,
        });
        continue;
      }

      await prisma.article.update({
        where: { id },
        data: {
          status: "SCHEDULED",
          publishTime: targetDate,
        },
      });

      results.push({ id, success: true, message: "Successfully scheduled." });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Failed";
      results.push({ id, success: false, message });
    }
  }

  return results;
}

/**
 * Goal 7: Batch Unpublish Articles
 */
export async function batchUnpublishArticles(
  articleIds: string[]
): Promise<BatchResultItem[]> {
  const session = await getServerSession(authOptions);
  if (!session?.user) throw new Error("Unauthorized");
  const user = session.user as { role: string };

  if (user.role !== "EDITOR") {
    throw new Error("Only editors can perform batch unpublishing.");
  }

  const results: BatchResultItem[] = [];

  for (const id of articleIds) {
    try {
      const article = await prisma.article.findUnique({ where: { id } });
      if (!article) {
        results.push({ id, success: false, message: "Article not found." });
        continue;
      }

      // Can only unpublish if Scheduled or Published
      if (article.status !== "SCHEDULED" && article.status !== "PUBLISHED") {
        results.push({
          id,
          success: false,
          message: `Cannot unpublish article in ${article.status} status.`,
        });
        continue;
      }

      await prisma.article.update({
        where: { id },
        data: {
          status: "APPROVED",
          publishTime: null,
        },
      });

      results.push({ id, success: true, message: "Successfully unpublished back to Approved." });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Failed";
      results.push({ id, success: false, message });
    }
  }

  return results;
}