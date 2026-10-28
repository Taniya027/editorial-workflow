import { prisma } from "@/lib/prisma";
import { ArticleStatus } from "@prisma/client";

export interface ArticleQueryParams {
  search?: string;
  sectionId?: string;
  status?: ArticleStatus;
  authorId?: string;
  sortBy?: "updatedAt" | "publishTime" | "status";
  sortOrder?: "asc" | "desc";
  page?: number;
  limit?: number;
}

// Alias for compatibility if imported as GetArticlesQueryOptions elsewhere
export type GetArticlesQueryOptions = ArticleQueryParams;

export async function getArticles(params: ArticleQueryParams) {
  const {
    search,
    sectionId,
    status,
    authorId,
    sortBy = "updatedAt",
    sortOrder = "desc",
    page = 1,
    limit = 10,
  } = params;

  const skip = (page - 1) * limit;

  const where = {
    ...(sectionId ? { sectionId } : {}),
    ...(status ? { status } : {}),
    ...(authorId ? { authorId } : {}),
    ...(search
      ? {
          OR: [
            { title: { contains: search, mode: "insensitive" as const } },
            { body: { contains: search, mode: "insensitive" as const } },
          ],
        }
      : {}),
  };

  const [articles, total] = await Promise.all([
    prisma.article.findMany({
      where,
      include: {
        author: true,
        section: true,
      },
      orderBy: {
        [sortBy]: sortOrder,
      },
      skip,
      take: limit,
    }),
    prisma.article.count({ where }),
  ]);

  return {
    articles,
    total,
    page,
    totalPages: Math.ceil(total / limit),
  };
}