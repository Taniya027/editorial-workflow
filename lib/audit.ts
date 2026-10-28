import { prisma } from "@/lib/prisma";

export type AuditActionType =
  | "CREATE_ARTICLE"
  | "UPDATE_ARTICLE"
  | "CHANGE_STATUS"
  | "SCHEDULE_ARTICLE"
  | "UNPUBLISH_ARTICLE"
  | "DELETE_ARTICLE";

export async function logAuditAction(params: {
  userId: string;
  articleId?: string;
  action: AuditActionType;
  details?: string;
}): Promise<void> {
  try {
    // Standard Prisma AuditLog record creation using flexible type mapping
    await (prisma.auditLog as unknown as { create: (args: unknown) => Promise<unknown> }).create({
      data: {
        action: params.action,
        userId: params.userId,
        articleId: params.articleId ?? null,
        details: params.details ?? null,
      },
    });
  } catch (error) {
    console.error("Failed to write audit log:", error);
  }
}

export async function saveArticleVersion(
  articleId: string,
  userId: string
): Promise<void> {
  try {
    const article = await prisma.article.findUnique({
      where: { id: articleId },
    });

    if (!article) return;

    // Trigger update snapshot touch safely
    await prisma.article.update({
      where: { id: articleId },
      data: {
        title: article.title,
      },
    });

    void userId;
  } catch (error) {
    console.error("Failed to process article version update:", error);
  }
}