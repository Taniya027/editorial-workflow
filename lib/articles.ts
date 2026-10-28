import { prisma } from "@/lib/prisma";
import { ArticleStatus, Prisma } from "@prisma/client";

export interface GetArticlesQueryOptions {
  // Authentication context
  userId: string;
  userRole: "EDITOR" | "WRITER";

  // Search, Filters & Pagination
  search?: string;
  sectionId?: string;
  status?: ArticleStatus;
  authorId?: string;
  sortBy?: "updatedAt" | "status" | "publishTime";
  sortOrder?: "asc" | "desc";
  page?: number;
  pageSize?: number;
}

export interface PaginatedArticlesResult {
  articles: Array<{
    id: string;
    title: string;
    body: string;
    status: ArticleStatus;
    updatedAt: Date;
    publishTime: Date | null;
    section: { id: string; name: string };
    author: { id: string; name: string | null; email: string };
  }>;
  totalMatches: number;
  totalPages: number;
  currentPage: number;
  pageSize: number;
}

/**
 * Goal 6: Server-side search, filtering, sorting, and pagination.
 * Ensures writers only see articles within sections they are assigned to.
 */
export async function getArticles(
  options: GetArticlesQueryOptions
): Promise<PaginatedArticlesResult> {
  const {
    userId,
    userRole,
    search,
    sectionId,
    status,
    authorId,
    sortBy = "updatedAt",
    sortOrder = "desc",
    page = 1,
    pageSize = 10,
  } = options;

  // Calculate skip for database pagination
  const currentPage = Math.max(1, page);
  const skip = (currentPage - 1) * pageSize;

  // Build the dynamic WHERE clause
  const where: Prisma.ArticleWhereInput = { AND: [] };
  const andConditions = where.AND as Prisma.ArticleWhereInput[];

  // 1. Enforce RBAC Section Visibility
  // Writers can only view articles in sections assigned to them
  if (userRole === "WRITER") {
    andConditions.push({
      section: {
        assignments: {
          some: {
            writerId: userId,
          },
        },
      },
    });
  }

  // 2. Text Search across Title and Body
  if (search && search.trim().length > 0) {
    const searchTerm = search.trim();
    andConditions.push({
      OR: [
        { title: { contains: searchTerm, mode: "insensitive" } },
        { body: { contains: searchTerm, mode: "insensitive" } },
      ],
    });
  }

  // 3. Section Filter
  if (sectionId) {
    andConditions.push({ sectionId });
  }

  // 4. Status Filter
  if (status) {
    andConditions.push({ status });
  }

  // 5. Author Filter
  if (authorId) {
    andConditions.push({ authorId });
  }

  // Build the dynamic ORDER BY clause
  const orderBy: Prisma.ArticleOrderByWithRelationInput = {
    [sortBy]: sortOrder,
  };

  // Execute queries in parallel using Promise.all for clean typing
  const [articles, totalMatches] = await Promise.all([
    prisma.article.findMany({
      where,
      orderBy,
      skip,
      take: pageSize,
      select: {
        id: true,
        title: true,
        body: true,
        status: true,
        updatedAt: true,
        publishTime: true,
        section: {
          select: { id: true, name: true },
        },
        author: {
          select: { id: true, name: true, email: true },
        },
      },
    }),
    prisma.article.count({ where }),
  ]);

  const totalPages = Math.ceil(totalMatches / pageSize);

  return {
    articles,
    totalMatches,
    totalPages,
    currentPage,
    pageSize,
  };
}